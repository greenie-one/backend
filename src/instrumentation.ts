import { env } from '@/config';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { NodeSDK } from '@opentelemetry/sdk-node';

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ALL);

const sdk = new NodeSDK({
  serviceName: `core-${env('APP_ENV')}`,
  autoDetectResources: true,
  traceExporter: new OTLPTraceExporter({
    url: `${env('OTEL_URL')}`,
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
