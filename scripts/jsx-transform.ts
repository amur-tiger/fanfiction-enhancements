import path from "node:path";
import fs from "node:fs/promises";
import type { Plugin } from "esbuild";
import babel, { type NodePath, type PluginObj } from "@babel/core";
import {
  type ArrayExpression,
  arrowFunctionExpression,
  callExpression,
  type CallExpression,
  type Expression,
  identifier,
  importDeclaration,
  importDefaultSpecifier,
  importSpecifier,
  isArrayExpression,
  isCallExpression,
  isIdentifier,
  isObjectExpression,
  isObjectProperty,
  isStringLiteral,
  type Node,
  type ObjectExpression,
  stringLiteral,
} from "@babel/types";
import type { Scope } from "@babel/traverse";
// @ts-ignore
import presetTypescript from "@babel/preset-typescript";
// @ts-ignore
import * as transformJsx from "@babel/plugin-transform-react-jsx";

export default function jsxTransform(): Plugin {
  const fileExists = async (filename: string) => {
    try {
      await fs.access(filename);
      return true;
    } catch {
      return false;
    }
  };

  return {
    name: "jsxTransform",
    setup(b) {
      b.onResolve({ filter: /.*/ }, async (args) => {
        if (args.resolveDir === "") return undefined;

        let maybePath = path.isAbsolute(args.path)
          ? args.path
          : path.relative(process.cwd(), path.join(args.resolveDir, args.path));
        if (!maybePath.toLowerCase().endsWith(".tsx")) {
          maybePath += ".tsx";
        }

        const exists = await fileExists(maybePath);
        if (exists) {
          return {
            path: maybePath,
            namespace: "jsx",
          };
        }
      });

      b.onLoad({ filter: /.*/, namespace: "jsx" }, async (args) => {
        const content = await fs.readFile(args.path, "utf-8");
        const result = await babel.transformAsync(content, {
          filename: args.path,
          presets: [presetTypescript],
          plugins: [babelTransform()],
        });

        return {
          contents: result?.code!,
          loader: "js",
          resolveDir: path.dirname(args.path),
        };
      });
    },
  };
}

function babelTransform(): PluginObj {
  let renderVariableName = "";
  let computeVariableName = "";

  function getRenderName(scope: Scope) {
    if (!renderVariableName) {
      renderVariableName = scope.generateUid("render");
    }
    return renderVariableName;
  }

  function getComputeName(scope: Scope) {
    if (!computeVariableName) {
      computeVariableName = scope.generateUid("compute");
    }
    return computeVariableName;
  }

  function isJsxCall(node: Node | null | undefined) {
    return (
      isCallExpression(node) &&
      (isIdentifier(node.callee, { name: "_jsx" }) || isIdentifier(node.callee, { name: "_jsxs" }))
    );
  }

  function isReactiveCall(node: CallExpression) {
    return (
      (isIdentifier(node.callee, { name: renderVariableName }) ||
        isIdentifier(node.callee, { name: computeVariableName })) &&
      node.arguments.length === 1
    );
  }

  function hasSignalCall(path: NodePath, withJsx = false): boolean {
    let hasCall = false;
    let hasJsx = false;

    path.traverse({
      ArrowFunctionExpression(p) {
        p.skip();
      },

      CallExpression(p) {
        if (isJsxCall(p.node)) {
          p.skip();
          hasJsx = true;
        } else if (isReactiveCall(p.node)) {
          p.skip();
        } else {
          p.stop();
          hasCall = true;
        }
      },
    });

    return withJsx ? hasCall && hasJsx : hasCall;
  }

  function wrapCall(path: NodePath<Expression>, func: string) {
    path.replaceWith(callExpression(identifier(func), [arrowFunctionExpression([], path.node)]));
    path.skip();
  }

  return {
    name: "jsxTransform",

    inherits(babel: any) {
      return transformJsx.default(babel, {
        runtime: "automatic",
        importSource: "@jsx",
        throwIfNamespace: false,
        useBuiltIns: true,
      });
    },

    visitor: {
      Program: {
        exit(path) {
          if (renderVariableName) {
            path.node.body.push(
              importDeclaration([importDefaultSpecifier(identifier(renderVariableName))], stringLiteral("@jsx/render")),
            );
          }
          if (computeVariableName) {
            path.node.body.push(
              importDeclaration(
                [importSpecifier(identifier(computeVariableName), identifier("compute"))],
                stringLiteral("@jsx/render"),
              ),
            );
          }
        },
      },

      CallExpression: {
        exit(path) {
          if (!(isJsxCall(path.node) && isObjectExpression(path.node.arguments[1])) || isReactiveCall(path.node)) {
            // skip if not jsx()-call, skip if jsx()-call was already wrapped
            return;
          }

          const props = path.get("arguments")[1] as NodePath<ObjectExpression>;
          for (const prop of props.get("properties")) {
            if (
              !isObjectProperty(prop.node) ||
              (isCallExpression(prop.node.value) && isIdentifier(prop.node.value.callee, { name: computeVariableName }))
            ) {
              continue;
            }

            const value = prop.get("value");
            if (Array.isArray(value)) {
              continue;
            }

            if (isIdentifier(prop.node.key, { name: "children" })) {
              // wrap each reactive child
              if (isArrayExpression(value.node)) {
                for (const item of (value as NodePath<ArrayExpression>).get("elements")) {
                  if (hasSignalCall(item as NodePath<Expression>)) {
                    wrapCall(item as NodePath<Expression>, getRenderName(item.scope));
                  }
                }
              } else {
                if (hasSignalCall(value)) {
                  wrapCall(value as NodePath<Expression>, getRenderName(value.scope));
                }
              }
            } else if (isStringLiteral(path.node.arguments[0])) {
              // for intrinsic elements, wrap attributes (components have to be re-rendered whole)
              if (hasSignalCall(prop)) {
                wrapCall(value as NodePath<Expression>, getComputeName(value.scope));
              }
            }
          }
        },
      },
    },
  };
}
