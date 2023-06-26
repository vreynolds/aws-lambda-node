const { trace, context, TraceFlags } = require('@opentelemetry/api');

let tracer = trace.getTracer("aws-lambda-tracer");

exports.handler = async function (event, ctx) {
  let newContext = trace.setSpanContext(context.active(), {
    traceId: event.traceId,
    spanId: event.spanId,
    traceFlags: TraceFlags.SAMPLED,
    isRemote: true });

  context.with(newContext, () => {
    const span = tracer.startSpan('handler function', newContext);
    span.end();
  });

  return context.logStreamName;
};
