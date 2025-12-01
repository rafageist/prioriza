function generate_all_plots()
  % Wrapper to ensure generate_all_plots is callable from repo root.
  this_dir = fileparts(mfilename('fullpath'));
  if isempty(this_dir)
    this_dir = pwd;
  end
  run(fullfile(this_dir, 'octave', 'generate_all_plots.m'));
end
