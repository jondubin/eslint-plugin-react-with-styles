/**
* @fileoverview Prevent usage of `{...css(styles.foo)}` with `className` or
*   `style` props.
* @author Joe Lencioni
*/
'use strict';

const rule = require('../../../lib/rules/only-spread-css');

const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    jsx: true,
  },
  sourceType: 'module',
};

const ruleTester = new RuleTester();
ruleTester.run('only-spread-css', rule, {

  valid: [
    {
      parserOptions,
      code: `
        <div className="foo" />
      `.trim(),
    },

    {
      parserOptions,
      code: `
        import { css } from 'withStyles';
        <div {...css(foo)} />
      `.trim(),
    },

    {
      parserOptions,
      code: `
        import { css } from 'withStyles';
        const bar = { baz: true };
        <div {...css(foo)} {...bar} />
      `.trim(),
    },

    {
      parserOptions,
      code: `
        import { css } from 'withStyles';
        import { bar } from 'somethingElse';
        <div {...css(foo)} {...bar()} />
      `.trim(),
    },

    {
      parserOptions,
      code: `
        import { css } from 'somethingElse';
        <div {...css(foo)} className="foo" />
      `.trim(),
    },

    {
      parserOptions,
      code: `
        import { css } from 'somethingElse';
        <div {...css(foo)} style={{ color: 'red' }} />
      `.trim(),
    },

    {
      parserOptions,
      code: `
        const { css } = require('somethingElse');
        <div {...css(foo)} className="foo" />
      `.trim(),
    },

    {
      parserOptions,
      code: `
        const { css } = require('somethingElse');
        <div {...css(foo)} style={{ color: 'red' }} />
      `.trim(),
    },

    {
      parserOptions,
      code: `
        require(foo);
        <div {...css(foo)} style={{ color: 'red' }} />
      `.trim(),
    },

    {
      parserOptions,
      code: `
        require();
        <div {...css(foo)} style={{ color: 'red' }} />
      `.trim(),
    },
  ],

  invalid: [
    {
      parserOptions,
      code: `
        import { css } from 'airbnb-dls-web/build/themes/withStyles';
        <div {...css(foo)} className="foo" />
      `.trim(),
      errors: [{
        message: 'Do not use `className` with `{...css()}`.',
        type: 'JSXAttribute',
      }],
    },

    {
      parserOptions,
      code: `
        import { css } from '../../themes/withStyles';
        <div {...css(foo)} className="foo" />
      `.trim(),
      errors: [{
        message: 'Do not use `className` with `{...css()}`.',
        type: 'JSXAttribute',
      }],
    },

    {
      parserOptions,
      code: `
        import { css } from 'withStyles';
        <div {...css(foo)} className="foo" />
      `.trim(),
      errors: [{
        message: 'Do not use `className` with `{...css()}`.',
        type: 'JSXAttribute',
      }],
    },

    {
      parserOptions,
      code: `
        import { css } from 'withStyles';
        <div className="foo" {...css(foo)} />
      `.trim(),
      errors: [{
        message: 'Do not use `className` with `{...css()}`.',
        type: 'JSXAttribute',
      }],
    },

    {
      parserOptions,
      code: `
        import { css } from 'withStyles';
        <div {...css(foo)} style="foo" />
      `.trim(),
      errors: [{
        message: 'Do not use `style` with `{...css()}`.',
        type: 'JSXAttribute',
      }],
    },

    {
      parserOptions,
      code: `
        import { css } from 'withStyles';
        const { style } = css(foo);
      `.trim(),
      errors: [{
        message: 'Only spread `css()` directly into an element, e.g. `<div {...css(foo)} />`.',
        type: 'CallExpression',
      }],
    },

    {
      parserOptions,
      code: `
        import { css } from 'withStyles';
        <div className={css(foo)} />
      `.trim(),
      errors: [{
        message: 'Only spread `css()` directly into an element, e.g. `<div {...css(foo)} />`.',
        type: 'CallExpression',
      }],
    },

    {
      parserOptions,
      code: `
        import { css } from 'withStyles';
        <div style={css(foo)} />
      `.trim(),
      errors: [{
        message: 'Only spread `css()` directly into an element, e.g. `<div {...css(foo)} />`.',
        type: 'CallExpression',
      }],
    },

    {
      parserOptions,
      code: `
        import { css } from 'withStyles';
        <div {...css(foo)} className="foo" style={{ color: 'red' }} />
      `.trim(),
      errors: [
        {
          message: 'Do not use `className` with `{...css()}`.',
          type: 'JSXAttribute',
        },
        {
          message: 'Do not use `style` with `{...css()}`.',
          type: 'JSXAttribute',
        },
      ],
    },

    {
      parserOptions,
      code: `
        import { css as bar } from 'withStyles';
        <div {...bar(foo)} className="foo" />
      `.trim(),
      errors: [{
        message: 'Do not use `className` with `{...bar()}`.',
        type: 'JSXAttribute',
      }],
    },

    {
      parserOptions,
      code: `
        const { css } = require('withStyles');
        <div {...css(foo)} className="foo" />
      `.trim(),
      errors: [{
        message: 'Do not use `className` with `{...css()}`.',
        type: 'JSXAttribute',
      }],
    },

    {
      parserOptions,
      code: `
        const { css } = require('withStyles');
        <div {...css(foo)} style="foo" />
      `.trim(),
      errors: [{
        message: 'Do not use `style` with `{...css()}`.',
        type: 'JSXAttribute',
      }],
    },

    {
      parserOptions,
      code: `
        const { css: bar } = require('withStyles');
        <div {...bar(foo)} className="foo" />
      `.trim(),
      errors: [{
        message: 'Do not use `className` with `{...bar()}`.',
        type: 'JSXAttribute',
      }],
    },
  ],
});
