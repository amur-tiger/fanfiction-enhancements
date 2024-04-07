import path from "node:path";
import fs from "node:fs/promises";
import type { Plugin } from "esbuild";
import babel, { type NodePath, type PluginObj, type PluginPass } from "@babel/core";
import {
  type ArrayExpression,
  arrowFunctionExpression,
  callExpression,
  type CallExpression,
  type Expression,
  identifier,
  type Identifier,
  importDeclaration,
  importDefaultSpecifier,
  importSpecifier,
  isArrayExpression,
  isCallExpression,
  isIdentifier,
  isObjectProperty,
  isStringLiteral,
  type Node,
  type ObjectExpression,
  stringLiteral,
} from "@babel/types";
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
  function isJsxCall(node: Node | null | undefined, pass: PluginPass): node is CallExpression {
    const jsx = pass.get("@babel/plugin-react-jsx/id/jsx")();
    const jsxs = pass.get("@babel/plugin-react-jsx/id/jsxs")();

    if (!isIdentifier(jsx) || !isIdentifier(jsxs)) {
      throw new TypeError("Could not determine jsx imported name.");
    }

    return isCallExpression(node) && (isIdentifier(node.callee, jsx) || isIdentifier(node.callee, jsxs));
  }

  function hasSignalCall(path: NodePath, pass: PluginPass): boolean {
    const options = {
      pass,
      hasCall: false,
    };

    path.traverse(
      {
        FunctionExpression(p) {
          p.skip();
        },

        ArrowFunctionExpression(p) {
          p.skip();
        },

        CallExpression(p, options) {
          if (isJsxCall(p.node, options.pass) && !isStringLiteral(p.node.arguments[0])) {
            p.skip();
          } else if (p.node.arguments.length === 0) {
            options.hasCall = true;
            p.stop();
          }
        },
      },
      options,
    );

    return options.hasCall;
  }

  function isWrapped(path: NodePath, pass: PluginPass) {
    if (path.parentPath == null || !path.parentPath.isArrowFunctionExpression()) {
      return false;
    }

    const render = pass.get("ffe-transform/imports/render");
    const compute = pass.get("ffe-transform/imports/compute");
    const call = path.parentPath.parentPath.node;

    return isCallExpression(call) && (isIdentifier(call.callee, render) || isIdentifier(call.callee, compute));
  }

  function wrapCall(path: NodePath<Expression>, func: Identifier, pass: PluginPass) {
    if (isWrapped(path, pass)) {
      return;
    }

    path.replaceWith(callExpression(func, [arrowFunctionExpression([], path.node)]));
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
      Program(path, pass) {
        const render = identifier(path.scope.generateUid("render"));
        pass.set("ffe-transform/imports/render", render);

        const compute = identifier(path.scope.generateUid("compute"));
        pass.set("ffe-transform/imports/compute", compute);

        path.node.body.unshift(
          importDeclaration(
            [importDefaultSpecifier(render), importSpecifier(compute, identifier("compute"))],
            stringLiteral("@jsx/render"),
          ),
        );
      },

      CallExpression: {
        exit(path, pass) {
          if (!isJsxCall(path.node, pass)) {
            // this call is not jsx or already wrapped
            return;
          }

          const isComponent = !isStringLiteral(path.node.arguments[0]);
          const props = path.get("arguments")[1] as NodePath<ObjectExpression>;

          for (const prop of props.get("properties")) {
            if (
              !isObjectProperty(prop.node) ||
              (isCallExpression(prop.node.value) && isJsxCall(prop.node.value.callee, pass))
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
                  if (hasSignalCall(item as NodePath<Expression>, pass)) {
                    wrapCall(item as NodePath<Expression>, pass.get("ffe-transform/imports/render"), pass);
                  }
                }
              } else {
                if (hasSignalCall(value, pass)) {
                  wrapCall(value as NodePath<Expression>, pass.get("ffe-transform/imports/render"), pass);
                }
              }
            } else if (!isComponent && hasSignalCall(prop, pass)) {
              // for intrinsic elements, wrap attributes (components have to be re-rendered whole)
              wrapCall(value as NodePath<Expression>, pass.get("ffe-transform/imports/compute"), pass);
            }
          }

          if (isComponent) {
            // always wrap components
            wrapCall(path, pass.get("ffe-transform/imports/render"), pass);
          }
        },
      },
    },
  };
}
