import { html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { AnchoredRegion as FoundationAnchoredRegion } from "../anchored-region.js";
import "./register.js";

type AnchoredRegionArgs = Args & FoundationAnchoredRegion;
type AnchoredRegionMeta = Meta<AnchoredRegionArgs>;

const storyTemplate = html<AnchoredRegionArgs>`
    <div style="height: 100%; width: 100%;" id="viewport">
        <div id="anchor" class=:"anchor" style=" transform: translate(120px, 120px);
        height: 60px; width: 60px; background: yellow; " > Anchor
    </div>
    <fast-anchored-region
        class="region"
        id="region"
        anchor="anchor"
        viewport="viewport"
        fixed-placement="${x => x.fixedPlacement}"
        vertical-positioning-mode="${x => x.verticalPositioningMode}"
        vertical-default-position="${x => x.verticalDefaultPosition}"
        vertical-inset="${x => x.verticalInset}"
        vertical-scaling="${x => x.verticalScaling}"
        horizontal-positioning-mode="${x => x.horizontalPositioningMode}"
        horizontal-default-position="${x => x.horizontalDefaultPosition}"
        horizontal-scaling="${x => x.horizontalScaling}"
        horizontal-inset="${x => x.horizontalInset}"
        auto-update-mode="${x => x.autoUpdateMode}"
    >
        ${x => x?.content}
    </fast-anchored-region>
    <div></div>
`;

export default {
    title: "AnchoredRegion",
    args: {
        content: html`
            <div style="background: green">
                anchored-region
            </div>
        `,
    },
    argTypes: {
        fixedPlacement: { control: { type: "boolean" } },
        verticalPositioningMode: {
            options: ["uncontrolled", "locktodefault", "dynamic"],
            control: { type: "select" },
            defaultValue: "locktodefault",
        },
        verticalDefaultPosition: {
            options: ["top", "bottom", "center", "unset"],
            control: { type: "select" },
            defaultValue: "top",
        },
        verticalInset: { control: { type: "boolean" } },
        verticalScaling: {
            options: ["anchor", "fill", "content"],
            control: { type: "select" },
        },
        horizontalPositioningMode: {
            options: ["uncontrolled", "locktodefault", "dynamic"],
            control: { type: "select" },
            defaultValue: "locktodefault",
        },
        horizontalDefaultPosition: {
            options: ["start", "end", "left", "right", "center", "unset"],
            control: { type: "select" },
            defaultValue: "left",
        },
        horizontalScaling: {
            options: ["anchor", "fill", "content"],
            control: { type: "select" },
        },
        horizontalInset: { control: { type: "boolean" } },
        autoupdateMode: {
            options: ["anchor", "auto"],
            control: { type: "select" },
        },
    },
} as AnchoredRegionMeta;

export const AnchoredRegion = (args: AnchoredRegionArgs) => {
    const storyFragment = new DocumentFragment();
    storyTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};