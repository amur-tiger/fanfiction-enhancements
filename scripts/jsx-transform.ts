import path from "node:path";
import fs from "node:fs/promises";
import type { Plugin } from "esbuild";
import babel, { type PluginObj } from "@babel/core";
import {
  arrowFunctionExpression,
  callExpression,
  type CallExpression,
  identifier,
  importDeclaration,
  importDefaultSpecifier,
  isArrowFunctionExpression,
  isIdentifier,
  isObjectExpression,
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
  let contextVariableName = "";

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
          if (contextVariableName) {
            path.node.body.push(
              importDeclaration(
                [importDefaultSpecifier(identifier(contextVariableName))],
                stringLiteral("@jsx/context"),
              ),
            );
          }
        },
      },

      CallExpression(path) {
        if (isJsxCall(path.node) && isObjectExpression(path.node.arguments[1])) {
          // checking if a call is a signal or not is too difficult at this point,
          // just wrap any node that has any call into a new context
          let hasCall = false;
          path.traverse({
            ArrowFunctionExpression(p) {
              p.skip();
            },

            CallExpression(p) {
              if (isJsxCall(p.node) || isRenderContextCall(p.node)) {
                p.skip();
                return;
              }

              if (p.node.arguments.length === 0) {
                p.stop();
                hasCall = true;
                if (!contextVariableName) {
                  contextVariableName = path.scope.generateUid("context");
                }
              }
            },
          });

          if (hasCall && !isArrowFunctionExpression(path.parent)) {
            path.replaceWith(callExpression(identifier(contextVariableName), [arrowFunctionExpression([], path.node)]));
            path.skip();
          }
        }
      },
    },
  };
}

function isJsxCall(node: CallExpression) {
  return isIdentifier(node.callee, { name: "_jsx" }) || isIdentifier(node.callee, { name: "_jsxs" });
}

function isRenderContextCall(node: CallExpression) {
  return isIdentifier(node.callee, { name: "context" }) && node.arguments.length === 1;
}
