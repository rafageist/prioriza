function [repoRoot, imagesDir] = plot_paths()
  % plot_paths Returns the repository root and images directory.
  % Usage: [repoRoot, imagesDir] = plot_paths();

  current = fileparts(mfilename('fullpath'));
  if isempty(current)
    current = pwd;
  end

  % utils/ is under octave/, so go two levels up to reach repo root
  repoRoot = fileparts(fileparts(current));
  if isempty(repoRoot)
    repoRoot = pwd;
  end

  imagesDir = fullfile(repoRoot, 'images');  % root-level images/

  if ~exist(imagesDir, 'dir')
    mkdir(imagesDir);
  end
end
