export default function (chunk) {
  if (!this.htmlWebpackPlugin.options.inject) {
    if (this.htmlWebpackPlugin.files.chunks[chunk]) {
      return `<link href="${this.htmlWebpackPlugin.files.chunks[chunk].css}" rel="stylesheet">`;
    }
  }
}