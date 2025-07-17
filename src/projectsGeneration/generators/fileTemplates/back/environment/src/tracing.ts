import {
  BootstrapEntityOptions,
  defaultBootstrapEntityOptions,
} from '../../../../../types'
import {printWarningIfRequired} from '../../../../../utils'

export const environmentTracerTmpl = (
  options: BootstrapEntityOptions = defaultBootstrapEntityOptions
) => `import {NodeSDK} from '@opentelemetry/sdk-node';
import {PrismaInstrumentation} from '@prisma/instrumentation';
import {getNodeAutoInstrumentations} from '@opentelemetry/auto-instrumentations-node';
import {OTLPTraceExporter} from '@opentelemetry/exporter-trace-otlp-http';
import {resourceFromAttributes} from '@opentelemetry/resources';
import {ATTR_SERVICE_NAME} from '@opentelemetry/semantic-conventions';
${printWarningIfRequired(options)}
// Configure the SDK
const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: '${options.projectPrefix}-back', // Or use env OTEL_SERVICE_NAME="my-service"
    // [ATTR_SERVICE_VERSION]: '1.2.3',
  }),
  traceExporter: new OTLPTraceExporter(),
  instrumentations: [getNodeAutoInstrumentations(), new PrismaInstrumentation()],
});

// Initialize the SDK
sdk.start();
`
