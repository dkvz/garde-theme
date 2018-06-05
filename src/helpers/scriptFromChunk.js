export default function (chunk) {
  if (this.htmlWebpackPlugin.files.chunks[chunk]) {
    return '<script lang="text/javascript" src="' + 
      this.htmlWebpackPlugin.files.chunks[chunk].entry + '"></script>'
  }
}