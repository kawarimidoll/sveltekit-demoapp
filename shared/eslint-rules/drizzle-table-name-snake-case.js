/***
 * example
 * ```js
 * // bad
 * export const bad = pgTable('tableName', {
 *   id: integer().primaryKey(),
 *   note: text(),
 * });
 * // good
 * export const good = pgTable('table_name', {
 *   id: integer().primaryKey(),
 *   note: text(),
 * });
 * // not check
 * const name = 'notCheck'
 * export const skip = pgTable(name, {
 *   id: integer().primaryKey(),
 *   note: text(),
 * });
 * ```
 */

export const drizzleTableNameSnakeCase = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure table name is snake_case.',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
  },

  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.name !== 'pgTable'
          && node.callee.name !== 'pgEnum') {
          return;
        }

        // skip unless first argument is literal
        if (node.arguments[0]?.type !== 'Literal') {
          return;
        }

        // report pgTable('table_name', {...})
        if (/[A-Z]/.test(node.arguments[0].raw)) {
          context.report({
            node,
            message: 'The first argument of `pgTable()` must be in snake_case.',
            fix(fixer) {
              return fixer.replaceText(
                node.arguments[0],
                node.arguments[0].raw.replace(/([a-zA-Z])(?=[A-Z])/g, '$1_').toLowerCase(),
              );
            },
          });
        }
      },
    };
  },
};

export const plugin = {
  rules: { 'drizzle-table-name-snake-case': drizzleTableNameSnakeCase },
};
