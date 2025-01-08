import {defineType, defineArrayMember} from 'sanity'
import {ImageIcon, CodeIcon, DocumentVideoIcon, BlockquoteIcon, TimelineIcon, TruncateIcon } from '@sanity/icons'

/**
 * This is the schema type for block content used in the post document type
 * Importing this type into the studio configuration's `schema` property
 * lets you reuse it in other document types with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'blockContent'
 *  }
 */

export const blockContentType = defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    // Text blocks with styles, lists, and annotations
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [{ title: 'Bullet', value: 'bullet' }],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            title: 'URL',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
              {
                title: "Open in a new window",
                name: 'blank',
                type: 'boolean'
              }
            ],
          },
        ],
      },
    }),
    // Images
    defineArrayMember({
      type: 'image',
      icon: ImageIcon,
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
    }),
    // Code blocks
    defineArrayMember({
      type: 'code',
      name: 'codeInput',
      title: 'Code',
      icon: CodeIcon,
    }),
    // Video embeds
    defineArrayMember({
      type: 'object',
      name: 'videoEmbed',
      title: 'Video Embed',
      icon: DocumentVideoIcon,
      fields: [
        {
          name: 'url',
          type: 'url',
          title: 'Video URL',
        },
      ],
    }),
    // Blockquote with author
    defineArrayMember({
      type: 'object',
      name: 'blockquote',
      title: 'Blockquote',
      icon: BlockquoteIcon,
      fields: [
        {
          name: 'text',
          type: 'string',
          title: 'Quote Text',
        },
        {
          name: 'author',
          type: 'string',
          title: 'Author',
        },
      ],
    }),

    // Table
    // defineArrayMember({
    //   type: 'object',
    //   name: 'table',
    //   title: 'Table',
    //   fields: [
    //     {
    //       name: 'rows',
    //       type: 'array',
    //       of: [{ type: 'array', of: [{ type: 'string' }] }],
    //       title: 'Rows',
    //     },
    //   ],
    // }),

    // Call to Action (CTA)
    defineArrayMember({
      type: 'object',
      name: 'callToAction',
      title: 'Call to Action',
      fields: [
        { name: 'text', type: 'string', title: 'Button Text' },
        { name: 'url', type: 'url', title: 'Button URL' },
      ],
    }),
    // Code Sandbox embeds
    // defineArrayMember({
    //   type: 'object',
    //   name: 'codeSandbox',
    //   title: 'Code Sandbox',
    //   fields: [
    //     {
    //       name: 'embedUrl',
    //       type: 'url',
    //       title: 'Embed URL',
    //     },
    //   ],
    // }),
    // Dividers
    defineArrayMember({
      type: 'object',
      name: 'divider',
      title: 'Divider',
      icon: TruncateIcon,
      fields: [
        {
          name: 'style',
          type: 'string',
          options: {
            list: ['dashed', 'solid', 'dotted'],
          },
        },
      ],
    }),
    // Timeline
    defineArrayMember({
      type: 'object',
      name: 'timeline',
      title: 'Timeline',
      icon: TimelineIcon,
      fields: [
        {
          name: 'events',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'date', type: 'string', title: 'Date' },
                { name: 'description', type: 'string', title: 'Description' },
              ],
            },
          ],
        },
      ],
    })
  ],
});
