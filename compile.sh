java -jar /opt/java/closure-compiler/compiler.jar \
  --manage_closure_dependencies true \
  --output_manifest manifest.MF \
  --js 'js/**.js' \
  --js 'closure-library/third_party/closure/ol3.5.0/**.js' \
  --js 'closure-library/third_party/closure/ol3.5.0.ext/**.js' \
  --js 'closure-library/third_party/closure/goog/**.js' \
  --js 'closure-library/closure/goog/**.js' \
  --only_closure_dependencies \
  --closure_entry_point 'osml.Site' \
  --closure_entry_point 'ol.layer.Tile' \
  --closure_entry_point 'ol.source.MapQuest' \
  --compilation_level WHITESPACE_ONLY \
  --formatting PRETTY_PRINT \
  --warning_level VERBOSE \
  --extra_annotation_name=api \
  --extra_annotation_name=observable \
  >osmlayers3-min.js

