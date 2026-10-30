import packageMetadata from '../package.json' with { type: 'json' };

/** Availability belongs beside adoption guidance, independently of maturity. */
export function CheckoutNotice() {
  return (
    <p className="checkout-notice" role="note">
      <strong>API version: {packageMetadata.version}.</strong> Install the
      matching package before copying these examples and API references.{' '}
      <a href="#quick-start">Installation and upgrade guidance</a>.
    </p>
  );
}
