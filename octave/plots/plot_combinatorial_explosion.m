function plot_combinatorial_explosion()
  % plot_combinatorial_explosion Generates 3D surface for f(n,m) = 3^m * n!

  [repoRoot, imagesDir] = plot_paths(); %#ok<ASGLU>

  n = 1:10;
  m = 1:10;
  [M, N] = meshgrid(m, n);
  Z = (3 .^ M) .* arrayfun(@factorial, N);

  f = figure('Visible', 'off');
  set(f, 'Units', 'pixels', 'Position', [100 100 1200 900]);
  surf(M, N, Z, 'EdgeColor', 'none', 'FaceAlpha', 0.95);
  shading interp;  % smooth gradients
  % Use parula if available, otherwise default colormap.
  try
    colormap('parula');
  catch
    % Fall back silently to default colormap when parula is missing (e.g., older Octave).
  end

  ax = gca;
  set(ax, 'Position', [0.14 0.12 0.64 0.78], 'FontSize', 11, ...
      'XGrid', 'on', 'YGrid', 'on', 'ZGrid', 'on', ...
      'GridColor', [0.6 0.6 0.6], 'GridAlpha', 0.6, 'GridLineStyle', '-', ...
      'LineWidth', 1.0);
  box(ax, 'on');
  view(ax, [-35 30]);

  xlabel(ax, 'm (parameters)');
  ylabel(ax, 'n (elements)');
  zlabel(ax, '3^m * n!');
  title(ax, 'Combinatorial growth: 3^m * n!');

  cb = colorbar;
  ylabel(cb, '3^m * n!');
  set(get(cb, 'ylabel'), 'FontSize', 10);

  pngPath = fullfile(imagesDir, 'combinatorial-explosion.png');
  print(f, '-dpng', '-r200', pngPath);
  close(f);
end
