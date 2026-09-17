// Plain, inline-styled HTML — email clients don't reliably support
// external/embedded CSS, so every style lives on the element itself.
// Single ~480px column, system font stack: short and mobile-friendly
// per BUILD_PLAN.md's Milestone 7 prompt.
export function renderEmailLayout(params: {
  previewText: string;
  bodyHtml: string;
  footerHtml?: string;
}): string {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title></title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f4f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <span style="display:none; max-height:0; overflow:hidden;">${params.previewText}</span>
    <div style="max-width:480px; margin:0 auto; padding:24px 16px;">
      <div style="background-color:#ffffff; border-radius:16px; padding:24px; color:#18181b;">
        ${params.bodyHtml}
      </div>
      ${
        params.footerHtml
          ? `<div style="padding:16px; text-align:center; font-size:12px; color:#71717a;">${params.footerHtml}</div>`
          : ""
      }
    </div>
  </body>
</html>`;
}
