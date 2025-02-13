import { EaCRuntimePlugin, EaCRuntimePluginConfig } from '@fathym/eac/runtime/plugins';
import { EaCRuntimeConfig } from '@fathym/eac/runtime/config';
import { EverythingAsCode } from '@fathym/eac';
import { EverythingAsCodeApplications } from '@fathym/eac-applications';
import { EaCProxyProcessor } from '@fathym/eac-applications/processors';

export default class RuntimePlugin implements EaCRuntimePlugin {
  constructor() {}

  public Setup(config: EaCRuntimeConfig) {
    const pluginConfig: EaCRuntimePluginConfig<
      EverythingAsCode & EverythingAsCodeApplications
    > = {
      Name: RuntimePlugin.name,
      Plugins: [],
      EaC: {
        Projects: {
          core: {
            Details: {
              Name: 'Open Biotech Core Runtime',
              Description: 'Open Biotech Core Runtime',
              Priority: 100,
            },
            ResolverConfigs: {
              localhost: {
                Hostname: 'localhost',
                Port: config.Server.port || 8000,
              },
              '127.0.0.1': {
                Hostname: '127.0.0.1',
                Port: config.Server.port || 8000,
              },
              'host.docker.internal': {
                Hostname: 'host.docker.internal',
                Port: config.Server.port || 8000,
              },
              'open-biotech.fathym.com': {
                Hostname: 'mosaic.fathym.com',
              },
              'www.openbiotech.co': {
                Hostname: 'www.openbiotech.co',
              },
              'open-biotech-core-runtime.azurewebsites.net': {
                Hostname: 'open-biotech-core-runtime.azurewebsites.net',
              },
            },
            ModifierResolvers: {},
            ApplicationResolvers: {
              oBiotechDataApi: {
                PathPattern: '/api/o-biotech/data*',
                Priority: 500,
              },
              synaptic: {
                PathPattern: '/api/synaptic*',
                Priority: 500,
              },
              web: {
                PathPattern: '*',
                Priority: 100,
              },
            },
          },
        },
        Applications: {
          oBiotechDataApi: {
            Details: {
              Name: 'API',
              Description: 'The API proxy.',
            },
            ModifierResolvers: {},
            Processor: {
              Type: 'Proxy',
              ProxyRoot: Deno.env.get('O_BIOTECH_DATA_API_ROOT')!,
            } as EaCProxyProcessor,
          },
          synaptic: {
            Details: {
              Name: 'Synaptic',
              Description: 'The API for accessing synaptic cricuits',
            },
            ModifierResolvers: {},
            Processor: {
              Type: 'Proxy',
              ProxyRoot: Deno.env.get('SYNAPTIC_ROOT')!,
            } as EaCProxyProcessor,
          },
          web: {
            Details: {
              Name: 'Dashboard',
              Description: 'The Dashboard.',
            },
            ModifierResolvers: {},
            Processor: {
              Type: 'Proxy',
              ProxyRoot: Deno.env.get('WEB_ROOT')!,
            } as EaCProxyProcessor,
          },
        },
      },
    };

    return Promise.resolve(pluginConfig);
  }
}
