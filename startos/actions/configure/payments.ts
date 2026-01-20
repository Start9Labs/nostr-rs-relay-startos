import { configToml } from '../../fileModels/config.toml'
import { sdk } from '../../sdk'
import { i18n } from '../../i18n'

const { InputSpec, Value, Variants } = sdk

// input spec
const inputSpec = InputSpec.of({
  enabled: Value.toggle({
    name: i18n('Enabled'),
    description: i18n(
      'Whether or not to make this a paid relay. If enabled, users must pay according to your setting here. If disabled, none of your setting here will take effect.',
    ),
    default: false,
  }),
  sign_ups: Value.toggle({
    name: i18n('Allow New Sign Ups'),
    description: i18n('Whether or not new sign ups should be allowed'),
    default: false,
  }),
  processor: Value.union({
    name: i18n('Processor'),
    default: 'ClnRest',
    variants: Variants.of({
      ClnRest: {
        name: 'ClnRest',
        spec: InputSpec.of({}),
      },
      LNBits: {
        name: 'LNBits',
        spec: InputSpec.of({
          api_secret: Value.text({
            name: i18n('API Secret'),
            description: i18n('Your LNBits API secret'),
            required: true,
            default: null,
            masked: true,
          }),
        }),
      },
    }),
  }),
  admission_cost: Value.number({
    name: i18n('Admission Cost'),
    description: i18n('The cost to be admitted to the relay'),
    required: false,
    default: null,
    integer: true,
    units: 'Sats',
    min: 1,
  }),
  cost_per_event: Value.number({
    name: i18n('Cost Per Event'),
    description: i18n('The cost per post'),
    required: false,
    default: null,
    integer: true,
    units: 'Sats',
    min: 1,
  }),
  direct_message: Value.union({
    name: i18n('Send Message on Signup'),
    description: i18n(
      'Optionally send a welcome message to new customers when they sign up',
    ),
    default: 'disabled',
    variants: Variants.of({
      disabled: {
        name: i18n('Disabled'),
        spec: InputSpec.of({}),
      },
      enabled: {
        name: i18n('Enabled'),
        spec: InputSpec.of({
          secret_key: Value.text({
            name: i18n('Secret Key (nsec)'),
            description: i18n(
              'The Nostr private key (nsec) from which to send the direct message',
            ),
            required: true,
            default: null,
          }),
          terms_message: Value.textarea({
            name: i18n('Terms of Service'),
            description: i18n('The message to send to new customers on signup'),
            required: true,
            default: `This service (and supporting services) are provided "as is", without warranty of any kind, express or implied.

By using this service, you agree:
* Not to engage in spam or abuse the relay service
* Not to disseminate illegal content
* That requests to delete content cannot be guaranteed
* To use the service in compliance with all applicable laws
* To grant necessary rights to your content for unlimited time
* To be of legal age and have capacity to use this service
* That the service may be terminated at any time without notice
* That the content you publish may be removed at any time without notice
* To have your IP address collected to detect abuse or misuse
* To cooperate with the relay to combat abuse or misuse
* You may be exposed to content that you might find triggering or distasteful
* The relay operator is not liable for content produced by users of the relay`,
          }),
        }),
      },
    }),
  }),
})

export const configurePayments = sdk.Action.withInput(
  // id
  'configure-payments',

  // metadata
  async ({ effects }) => ({
    name: i18n('Paid Relay Settings'),
    description: i18n('Require payment to use this relay'),
    warning: null,
    allowedStatuses: 'any',
    group: 'configure',
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async function ({ effects }) {
    const pay_to_relay = await configToml.read((c) => c.pay_to_relay).once()
    if (!pay_to_relay) return

    return {
      ...pay_to_relay,
      processor:
        pay_to_relay.processor === 'LNBits'
          ? {
              selection: 'LNBits' as const,
              value: {
                api_secret: pay_to_relay.api_secret,
              },
            }
          : {
              selection: 'ClnRest' as const,
              value: {},
            },
      direct_message: pay_to_relay.direct_message
        ? {
            selection: 'enabled' as const,
            value: {
              secret_key: pay_to_relay.secret_key,
              terms_message: pay_to_relay.terms_message,
            },
          }
        : {
            selection: 'disabled' as const,
            value: {},
          },
    }
  },

  // the execution function
  async ({ effects, input }) =>
    configToml.merge(effects, {
      pay_to_relay: {
        ...(input.direct_message.selection === 'enabled'
          ? {
              direct_message: true,
              secret_key: input.direct_message.value.secret_key,
              terms_message: input.direct_message.value.terms_message,
            }
          : {
              direct_message: false,
              secret_key: undefined,
            }),
        ...(input.processor.selection === 'ClnRest'
          ? {
              processor: 'ClnRest',
            }
          : {
              processor: 'LNBits',
              api_secret: input.processor.value.api_secret,
            }),
      },
    }),
)
