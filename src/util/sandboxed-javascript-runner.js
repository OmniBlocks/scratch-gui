export default async function runInSandbox(executeFn) {
  try {
    const result = await executeFn();

    // If the VM already returned the expected shape, pass it through.
    if (result && typeof result === 'object' && 'value' in result && 'success' in result) {
      return result;
    }

    // Otherwise normalize to the guarded shape.
    return {
      value: result,
      success: true
    };
  } catch (err) {
    // Do not throw here — surface errors in the return shape so callers can
    // handle them without crashing the renderer.
    return {
      value: undefined,
      success: false,
      error: err && err.message ? String(err.message) : String(err)
    };
  }
}
