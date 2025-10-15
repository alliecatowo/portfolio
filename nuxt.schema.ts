import { field, group } from '@nuxt/content/preview'

export default defineNuxtSchema({
  appConfig: {
    ui: group({
      title: 'UI',
      description: 'Customize global UI tokens and component defaults.',
      icon: 'i-ph-palette',
      fields: {
        colors: group({
          title: 'Color Tokens',
          description: 'Alias global UI colors to Tailwind palette names.',
          icon: 'i-ph-paint-brush',
          fields: {
            primary: field({
              type: 'string',
              title: 'Primary color',
              description: 'Tailwind color family used for primary accents.',
              icon: 'i-ph-drop',
              default: 'pink'
            }),
            neutral: field({
              type: 'string',
              title: 'Neutral color',
              description: 'Tailwind color family used for neutral elements.',
              icon: 'i-ph-drop-half',
              default: 'slate'
            })
          }
        }),
        button: group({
          title: 'Button Defaults',
          description: 'Default props applied to every button component.',
          icon: 'i-ph-cursor-click',
          fields: {
            default: group({
              title: 'Default Variant',
              description: 'Fine-tune the default appearance of buttons.',
              icon: 'i-ph-sliders-horizontal',
              fields: {
                size: field({
                  type: 'string',
                  title: 'Size',
                  description: 'Default button size token.',
                  icon: 'i-ph-arrows-out-line-horizontal',
                  default: 'md',
                  required: ['xs', 'sm', 'md', 'lg', 'xl']
                }),
                color: field({
                  type: 'string',
                  title: 'Color',
                  description: 'Color variant used by default.',
                  icon: 'i-ph-paint-brush-broad',
                  default: 'primary'
                }),
                variant: field({
                  type: 'string',
                  title: 'Variant',
                  description: 'Visual variant for default buttons.',
                  icon: 'i-ph-squares-four',
                  default: 'solid',
                  required: ['solid', 'outline', 'soft', 'ghost', 'link']
                })
              }
            })
          }
        }),
        checkbox: group({
          title: 'Checkbox Defaults',
          description: 'Default props applied to checkboxes.',
          icon: 'i-ph-check-square-offset',
          fields: {
            default: group({
              title: 'Default Variant',
              description: 'Fine-tune the default appearance of checkboxes.',
              icon: 'i-ph-sliders-horizontal',
              fields: {
                size: field({
                  type: 'string',
                  title: 'Size',
                  description: 'Default checkbox size token.',
                  icon: 'i-ph-arrows-out-line-horizontal',
                  default: 'sm',
                  required: ['xs', 'sm', 'md', 'lg']
                })
              }
            })
          }
        }),
        card: group({
          title: 'Card Defaults',
          description: 'Default Tailwind classes applied to cards.',
          icon: 'i-ph-credit-card',
          fields: {
            default: group({
              title: 'Default Styles',
              description: 'Customize the base card appearance.',
              icon: 'i-ph-sliders-horizontal',
              fields: {
                background: field({
                  type: 'string',
                  title: 'Background classes',
                  description: 'Space-separated Tailwind classes applied to the card background.',
                  icon: 'i-ph-square',
                  default: 'white dark:bg-gray-950'
                }),
                ring: field({
                  type: 'string',
                  title: 'Ring classes',
                  description: 'Ring-related Tailwind classes applied to the card.',
                  icon: 'i-ph-circle-dashed',
                  default: 'ring-1 ring-gray-200 dark:ring-gray-800/60'
                }),
                rounded: field({
                  type: 'string',
                  title: 'Border radius classes',
                  description: 'Rounded classes controlling card corner radius.',
                  icon: 'i-ph-corners-out',
                  default: 'rounded-lg'
                }),
                shadow: field({
                  type: 'string',
                  title: 'Shadow classes',
                  description: 'Shadow utilities applied to the card.',
                  icon: 'i-ph-shadow',
                  default: 'shadow-sm'
                })
              }
            })
          }
        }),
        input: group({
          title: 'Input Defaults',
          description: 'Default props applied to input components.',
          icon: 'i-ph-textbox',
          fields: {
            default: group({
              title: 'Default Variant',
              description: 'Fine-tune the default appearance of inputs.',
              icon: 'i-ph-sliders-horizontal',
              fields: {
                size: field({
                  type: 'string',
                  title: 'Size',
                  description: 'Default input size token.',
                  icon: 'i-ph-arrows-out-line-horizontal',
                  default: 'md',
                  required: ['xs', 'sm', 'md', 'lg', 'xl']
                }),
                color: field({
                  type: 'string',
                  title: 'Color',
                  description: 'Color variant used by default.',
                  icon: 'i-ph-paint-brush-broad',
                  default: 'primary'
                }),
                variant: field({
                  type: 'string',
                  title: 'Variant',
                  description: 'Visual variant for default inputs.',
                  icon: 'i-ph-squares-four',
                  default: 'outline',
                  required: ['solid', 'outline', 'soft', 'ghost']
                })
              }
            })
          }
        }),
        pagination: group({
          title: 'Pagination Slots',
          description: 'Tailwind utility classes assigned to pagination slots.',
          icon: 'i-ph-dots-three-outline',
          fields: {
            slots: group({
              title: 'Slot Classes',
              description: 'Customize layout classes for pagination parts.',
              icon: 'i-ph-layout',
              fields: {
                root: field({
                  type: 'string',
                  title: 'Root',
                  description: 'Classes applied to the root wrapper.',
                  icon: 'i-ph-square',
                  default: 'w-full'
                }),
                list: field({
                  type: 'string',
                  title: 'List',
                  description: 'Classes applied to the pagination list.',
                  icon: 'i-ph-list-dashes',
                  default: 'flex justify-center gap-1'
                }),
                item: field({
                  type: 'string',
                  title: 'Item',
                  description: 'Classes applied to pagination items.',
                  icon: 'i-ph-square-logo',
                  default: 'rounded-md'
                }),
                label: field({
                  type: 'string',
                  title: 'Label',
                  description: 'Classes applied to pagination labels.',
                  icon: 'i-ph-text-t',
                  default: 'min-w-7 text-center'
                })
              }
            })
          }
        })
      }
    })
  }
})
