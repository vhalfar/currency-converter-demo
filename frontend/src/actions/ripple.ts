import Ripple from "@smui/ripple"

export function ripple(node: HTMLElement): void {
  Ripple(node, {
    surface: true,
    color: "primary",
  })
}
