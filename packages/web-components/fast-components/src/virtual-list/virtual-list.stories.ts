import { html, ViewTemplate, when } from "@microsoft/fast-element";
import addons from "@storybook/addons";
import { STORY_RENDERED } from "@storybook/core-events";
import {
    VirtualList as FoundationVirtualList,
    SizeMap,
    Slider,
    VirtualListItem,
} from "@microsoft/fast-foundation";
import VirtualListTemplate from "./fixtures/base.html";

let data;
let gridData;

const horizontalImageItemTemplate = html`
    <fast-card
        style="
            position: absolute;
            contain: strict;
            height:  100%;
            width:  ${(x, c) => `${c.parent.visibleItemMap[c.index]?.size}px`};
            transform: ${(x, c) =>
            `translateX(${c.parent.visibleItemMap[c.index]?.start}px)`};
        "
    >
        <div style="margin: 5px 20px 0 20px; color: white">
            ${x => x.title}
        </div>

        <div
            style="
                height: 160px;
                width:160px;
                margin:10px 20px 10px 20px;
                position: absolute;
                background-image: url('${x => x.url}');
            "
        ></div>
    </fast-card>
`;

const gridItemTemplate = html`
    <div
        style="
            contain: strict;
            position: absolute;
            height: 200px;
            width:  200px;
            transform: ${(x, c) =>
            `translateX(${c.parent.visibleItemMap[c.index]?.start}px)`};
        "
    >
        <div
            style="
            position: absolute;
            margin: 90px 20px 0 20px;
        "
        >
            ${x => x.title}
        </div>

        <div
            style="
                background: gray;
                height:100%;
                width:100%;
                background-image: url('${x => x.url}');
            "
        ></div>
    </div>
`;

const rowItemTemplate = html`
    <fast-virtual-list
        auto-update-mode="viewport"
        orientation="horizontal"
        item-size="200"
        viewport-buffer="100"
        :viewportElement="${(x, c) => c.parent.viewportElement}"
        :itemTemplate="${gridItemTemplate}"
        :items="${x => x.items}"
        style="
            display: block;
            position: absolute;
            height:  200px;
            transform: ${(x, c) =>
            `translateY(${c.parent.visibleItemMap[c.index]?.start}px)`};
        "
    ></fast-virtual-list>
`;

const listItemContentsTemplate = html`
    <fast-card>
        <div
            style="
                margin: 5px 20px 0 20px;
                color: white;
            "
        >
            ${x => x.listItemContext.titleString} ${x => x.itemData.title}
        </div>
        ${when(
            x => x.loadContent,
            html`
                <div
                    style="
                        height: 160px;
                        width:160px;
                        margin:10px 20px 10px 20px;
                        background-image: url('${x => x.itemData.url}');
                "
                ></div>
            `
        )}
        ${when(
            x => !x.loadContent,
            html`
                <div
                    style="
                    background: white;
                    opacity: 0.2;
                    height: 160px;
                    width:160px;
                    margin:10px 20px 10px 20px;
            "
                ></div>
            `
        )}
    </fast-card>
`;

const toggleHeightItemTemplate = html`
    <fast-virtual-list-item
        :itemData="${x => x}"
        :itemIndex="${(x, c) => c.index + c.parent.firstRenderedIndex}"
        :listItemContext="${(x, c) => c.parent.listItemContext}"
        :idleCallbackQueue="${(x, c) => c.parent.idleCallbackQueue}"
        :loadMode="${(x, c) => c.parent.listItemLoadMode}"
        :listItemContentsTemplate="${(x, c) => c.parent.listItemContentsTemplate}"
        style="
            height: ${(x, c) => `${c.parent.visibleItemMap[c.index]?.size}px`};
            transform: ${(x, c) =>
            `translateY(${c.parent.visibleItemMap[c.index]?.start}px)`};
        "
    ></fast-virtual-list-item>
`;

const toggleHeightContentsTemplate = html`
    <div
        style="
            width: 200px;
            height: 100%;
        "
    >
        <fast-button
            style="
                width: 100%;
                height: 100%;
                background-image: url('${x => x.itemData.url}');
                background-size: cover;
                background-position: center center;
                background-repeat: no-repeat;
                background-size: 100% 100%;
                background-color: darkgray;
            "
            @click="${(x, c) => toggleSizeMap(c.event, x.itemIndex)}"
        >
            <div
                style="
                background-color: black;
            "
            >
                ${x => x.listItemContext.titleString} ${x => x.itemData.title}
            </div>
        </fast-button>
    </div>
`;

const variableHeightContentsTemplate = html`
    <div
        style="
            width: 200px;
            contain: layout;
        "
    >
        <div
            style="
                margin: 4px;
                height: calc(100% - 8px);
                width: calc(100% - 8px);
                position: absolute;
                background-image: url('${x => x.itemData.url}');
                background-size: cover;
                background-position: center center;
                background-repeat: no-repeat;
                background-size: 100% 100%;
                background-color: darkgray;
            "
        >
            <div style="background-color: white; position: absolute; margin: 10px;">
                ${x => x.listItemContext.titleString} ${x => x.itemData.title}
            </div>
        </div>

        <div
            style="
                width: 100%;
                height: ${x =>
                !x.loadContent ? x.itemSizeMap.size : x.itemData.itemSize}px;
                transition: height 0.1s ease-out;
            "
        >
            ${when(
                x => x.loadContent,
                html`
                    <fast-slider
                        style="
                            width: 180px;
                            margin: 50px 10px 0 10px;
                        "
                        min="100"
                        max="400"
                        step="1"
                        value="${x => x.itemData.itemSize}"
                        @change="${(x, c) => {
                            if (
                                x.itemData.itemSize !==
                                (c.event.target as Slider).currentValue
                            ) {
                                x.itemData.itemSize = (c.event
                                    .target as Slider).currentValue;
                                ((c.event.target as Slider)
                                    .parentElement as HTMLElement).style.height = `${
                                    (c.event.target as Slider).currentValue
                                }px`;
                            }
                        }}"
                    ></fast-slider>
                `
            )}
        </div>
    </div>
`;

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("virtual-list")) {
        data = newDataSet(5000, 1);

        gridData = [];

        for (let i = 1; i <= 1000; i++) {
            gridData.push({
                items: newDataSet(1000, i),
            });
        }

        const stackh1 = document.getElementById("stackh1") as FoundationVirtualList;
        stackh1.listItemContentsTemplate = listItemContentsTemplate;
        stackh1.listItemContext = {
            titleString: "title:",
        };
        stackh1.items = newDataSet(50, 1);

        const stackh2 = document.getElementById("stackh2") as FoundationVirtualList;
        stackh2.listItemContentsTemplate = listItemContentsTemplate;
        stackh2.listItemContext = {
            titleString: "title:",
        };
        stackh2.items = data;

        const stackhImmediate = document.getElementById(
            "stackhimmediate"
        ) as FoundationVirtualList;
        stackhImmediate.listItemContentsTemplate = listItemContentsTemplate;
        stackhImmediate.listItemContext = {
            titleString: "title:",
        };
        stackhImmediate.items = data;

        const stackh3 = document.getElementById("stackh3") as FoundationVirtualList;
        stackh3.itemTemplate = horizontalImageItemTemplate;
        stackh3.items = data;

        const stackh4 = document.getElementById("stackh4") as FoundationVirtualList;
        stackh4.itemTemplate = horizontalImageItemTemplate;
        stackh4.items = data;

        const stackGrid = document.getElementById("stackgrid") as FoundationVirtualList;
        stackGrid.itemTemplate = rowItemTemplate;
        stackGrid.items = gridData;

        const stackv1 = document.getElementById("stackv1") as FoundationVirtualList;
        stackv1.viewportElement = document.documentElement;
        stackv1.listItemContentsTemplate = variableHeightContentsTemplate;
        stackv1.listItemContext = {
            titleString: "title:",
        };
        stackv1.items = newDataSet(5000, 1);

        const stackv2 = document.getElementById("stackv2") as FoundationVirtualList;
        stackv2.items = data;
        stackv2.listItemContentsTemplate = listItemContentsTemplate;
        stackv2.listItemContext = {
            titleString: "title:",
        };

        const stackv3 = document.getElementById("stackv3") as FoundationVirtualList;
        stackv3.items = newDataSet(1000, 1);
        stackv3.sizemap = generateSizeMap(stackv3.items);
        stackv3.viewportElement = document.documentElement;
        stackv3.itemTemplate = toggleHeightItemTemplate;
        stackv3.listItemContentsTemplate = toggleHeightContentsTemplate;
        stackv3.listItemContext = {
            titleString: "title:",
        };

        const reloadImmediateButton = document.getElementById("reloadimmediate");
        if (reloadImmediateButton) {
            reloadImmediateButton.onclick = reloadImmediate;
        }

        const reloadIdleButton = document.getElementById("reloadidle");
        if (reloadIdleButton) {
            reloadIdleButton.onclick = reloadIdle;
        }
    }
});

// sets the height of an item by setting a value in the sizemap directly
function toggleSizeMap(e: Event, index: number): void {
    const stackv3 = document.getElementById("stackv3") as FoundationVirtualList;

    let currentPosition: number = 0;
    const toggleMap: SizeMap[] = stackv3.sizemap.slice(0, index);

    if (index > 0) {
        currentPosition = toggleMap[index - 1].end;
    }

    const baseSize: number = (stackv3.items[index] as any).itemSize;
    const collapsedSize: number = (stackv3.items[index] as any).itemCollapsedSize;

    const changeSize: number =
        stackv3.sizemap[index].size === baseSize ? collapsedSize : baseSize;

    toggleMap.push({
        start: currentPosition,
        size: changeSize,
        end: currentPosition + changeSize,
    });

    const mapLength: number = stackv3.sizemap.length;

    for (let i: number = index + 1; i < mapLength; i++) {
        currentPosition = toggleMap[i - 1].end;

        toggleMap.push({
            start: currentPosition,
            size: stackv3.sizemap[i].size,
            end: currentPosition + stackv3.sizemap[i].size,
        });
    }

    // big modifications directly to large arrays won't perform well
    // until we can observe an array without calculating splices
    // stackv3.sizemap.splice(0, stackv3.sizemap.length, ...toggleMap);

    stackv3.sizemap = toggleMap;
}

// do a full reload of the "immediate" list
function reloadImmediate(): void {
    const stackhImmediate = document.getElementById(
        "stackhimmediate"
    ) as FoundationVirtualList;
    stackhImmediate.items = [];
    window.setTimeout(() => {
        stackhImmediate.items = data;
    }, 50);
}

// do a full reload of the "idle" list
function reloadIdle(): void {
    const stackhIdle = document.getElementById("stackh2") as FoundationVirtualList;
    stackhIdle.items = [];
    window.setTimeout(() => {
        stackhIdle.items = data;
    }, 50);
}

// create a sample data set
function newDataSet(rowCount: number, prefix: number): object[] {
    const newData: object[] = [];
    for (let i = 1; i <= rowCount; i++) {
        newData.push({
            value: `${i}`,
            title: `item #${i}`,
            url: `https://picsum.photos/200/200?random=${prefix * 1000 + i}`,
            itemSize: 100 + Math.floor(Math.random() * 300),
            itemCollapsedSize: 100,
        });
    }
    return newData;
}

// generate a sizemap for a data set
function generateSizeMap(data: object[]) {
    const sizemap: SizeMap[] = [];
    const itemsCount: number = data.length;
    let currentPosition: number = 0;
    for (let i = 0; i < itemsCount; i++) {
        const itemSize = (data[i] as any).itemSize;
        const mapEnd = itemSize + currentPosition;
        sizemap.push({
            start: currentPosition,
            size: itemSize,
            end: mapEnd,
        });
        currentPosition = mapEnd;
    }
    return sizemap;
}

export default {
    title: "Virtual List",
};

export const VirtualList = () => VirtualListTemplate;