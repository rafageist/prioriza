% Driver script to generate all plots.
this_dir = fileparts(mfilename('fullpath'));
if isempty(this_dir)
  this_dir = pwd;
end
addpath(fullfile(this_dir, 'utils'));
addpath(fullfile(this_dir, 'plots'));

plot_combinatorial_explosion();
