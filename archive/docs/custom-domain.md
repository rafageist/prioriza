# Custom Domain

Target public domain:

```text
prioriza.rafageist.com
```

## GitHub Pages

After the Pages workflow is confirmed working, enable the custom domain in the
repository Pages settings and add a `docs/CNAME` file containing:

```text
prioriza.rafageist.com
```

The Pages workflow copies `docs/CNAME` to the published root when that file is
present. Do not add the file until the domain is ready to be activated.

## DNS

Create this DNS record at the domain provider:

```text
Type:  CNAME
Name:  prioriza
Value: rafageist.github.io
```

Then wait for DNS propagation, verify the custom domain in GitHub Pages, and
enable HTTPS from the Pages settings.

No secrets are required for this setup, and DNS changes should not be made from
this repository.
