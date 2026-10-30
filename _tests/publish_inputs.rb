# frozen_string_literal: true

# Run with: bundle exec ruby _tests/publish_inputs.rb
require "bundler/setup"
require "jekyll"
require "tmpdir"

source = File.expand_path("..", __dir__)

Dir.mktmpdir("jekyll-publish-inputs-") do |destination|
  site = Jekyll::Site.new(Jekyll.configuration(
    "source" => source,
    "config" => File.join(source, "_config.yml"),
    "destination" => destination,
    "disable_disk_cache" => true
  ))
  site.read

  paths = (site.pages + site.static_files).map do |file|
    file.relative_path.sub(%r{\A/}, "")
  end

  internal_docs = paths.select { |path| path.start_with?("docs/superpowers/") }
  abort "FAIL: internal plans/specs enter the Pages build: #{internal_docs.join(', ')}" unless internal_docs.empty?

  game_files = Dir.glob(File.join(source, "qingshan-wenlu", "**", "*"))
                  .select { |path| File.file?(path) }
                  .map { |path| path.delete_prefix("#{source}/") }
  required = ["index.html", "algorithms/index.html", "qingshan-wenlu/index.html"] + game_files
  missing = required.uniq - paths
  abort "FAIL: public pages or game assets excluded: #{missing.join(', ')}" unless missing.empty?

  puts "PASS: internal documents excluded; homepage, algorithms and #{game_files.length} game files included"
end
