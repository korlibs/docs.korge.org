Object.prototype.also = function(block) {
    block(this)
    return this
}

/*
const canvasData = {
	"nodes":[
		{"id":"b615b540f83c4859","type":"text","text":"## KorGE Targets","x":-280,"y":-215,"width":160,"height":75,"color":"4"},
		{"id":"1be09a0ccfd39f52","type":"text","text":"WEB","x":-377,"y":0,"width":97,"height":50},
		{"id":"40d7763b467d2b39","type":"text","text":"JS","x":-416,"y":100,"width":78,"height":56},
		{"id":"4705b4f5df4eecab","type":"text","text":"[WASM JS](https://webassembly.org/roadmap/)","x":-328,"y":100,"width":148,"height":56},
		{"id":"7ed1ce81c0695205","type":"text","text":"DESKTOP","x":-100,"y":0,"width":131,"height":50},
		{"id":"863422e3e5046a21","x":-84,"y":98,"width":99,"height":60,"type":"text","text":"JVM"},
		{"id":"db39899bfd5a3560","type":"text","text":"WASI","x":31,"y":-215,"width":100,"height":60,"color":"1"},
		{"id":"2ff9c3353553d2d7","x":208,"y":-214,"width":112,"height":59,"color":"2","type":"text","text":"wasm2c"},
		{"id":"e6fefca58baf6777","x":425,"y":-315,"width":215,"height":55,"type":"text","text":"Consoles / Homebrew"},
		{"id":"672bb2ef8fa4b470","x":425,"y":-215,"width":156,"height":58,"type":"text","text":"Raspberry PI"},
		{"id":"263ccbf42d3e3c35","x":425,"y":-112,"width":215,"height":60,"type":"text","text":"Native executables on desktop"},
		{"id":"1c03e4829fb51076","x":-436,"y":-580,"width":155,"height":60,"type":"text","text":"JVM/Android"},
		{"id":"bb6f2a1371caac1b","x":-426,"y":-455,"width":135,"height":50,"type":"text","text":"Android"},
		{"id":"a81e073cfd06ba1c","x":-129,"y":-578,"width":153,"height":58,"type":"text","text":"Kotlin Native"},
		{"id":"237ca2db2388ed2a","x":425,"y":-10,"width":250,"height":60,"type":"text","text":"iOS/tvOS eventually?"},
		{"id":"2422ec0a1f0a8290","x":-115,"y":-455,"width":126,"height":50,"type":"text","text":"iOS/tvOS"},
		{"id":"665f2158c087e799","x":-686,"y":-289,"width":250,"height":209,"type":"text","text":"### Note:\n\nWe support integrations on all the targets, via a canvas or native widgets."}
	],
	"edges":[
		{"id":"e6764c35c8b1f838","fromNode":"b615b540f83c4859","fromSide":"right","toNode":"db39899bfd5a3560","toSide":"left","color":"1","label":"future"},
		{"id":"b0485f55bf09006d","fromNode":"b615b540f83c4859","fromSide":"bottom","toNode":"1be09a0ccfd39f52","toSide":"top"},
		{"id":"b774c1a457e56097","fromNode":"1be09a0ccfd39f52","fromSide":"bottom","toNode":"40d7763b467d2b39","toSide":"top"},
		{"id":"c8536b704116ebbe","fromNode":"1be09a0ccfd39f52","fromSide":"bottom","toNode":"4705b4f5df4eecab","toSide":"top"},
		{"id":"9cb05c044a73ff99","fromNode":"b615b540f83c4859","fromSide":"bottom","toNode":"7ed1ce81c0695205","toSide":"top"},
		{"id":"c00bf831a0024667","fromNode":"7ed1ce81c0695205","fromSide":"bottom","toNode":"863422e3e5046a21","toSide":"top"},
		{"id":"e0523ebcce74277b","fromNode":"db39899bfd5a3560","fromSide":"right","toNode":"2ff9c3353553d2d7","toSide":"left"},
		{"id":"04c1a591d4e9f1b4","fromNode":"2ff9c3353553d2d7","fromSide":"right","toNode":"e6fefca58baf6777","toSide":"left"},
		{"id":"cb15da172f5eea4b","fromNode":"2ff9c3353553d2d7","fromSide":"right","toNode":"672bb2ef8fa4b470","toSide":"left"},
		{"id":"20108cbba1e30f25","fromNode":"2ff9c3353553d2d7","fromSide":"right","toNode":"263ccbf42d3e3c35","toSide":"left"},
		{"id":"54beb520b62a3f4f","fromNode":"b615b540f83c4859","fromSide":"top","toNode":"bb6f2a1371caac1b","toSide":"bottom"},
		{"id":"b7d16985e3f6890a","fromNode":"bb6f2a1371caac1b","fromSide":"top","toNode":"1c03e4829fb51076","toSide":"bottom"},
		{"id":"f2fde9f4cf8cea52","fromNode":"b615b540f83c4859","fromSide":"top","toNode":"2422ec0a1f0a8290","toSide":"bottom"},
		{"id":"b71ceb6b4f8102be","fromNode":"2422ec0a1f0a8290","fromSide":"top","toNode":"a81e073cfd06ba1c","toSide":"bottom"},
		{"id":"05da6c1b3b1eebe4","fromNode":"2ff9c3353553d2d7","fromSide":"right","toNode":"237ca2db2388ed2a","toSide":"left"}
	]
}
*/

/**
 * 
 * @param {string} name 
 * @param {function(SVGElement): void} func 
 * @returns {SVGElement}
 */
function createSVG(name, func = undefined) {
    const SVGNS = "http://www.w3.org/2000/svg"
    const out = document.createElementNS(SVGNS, name)
    if (typeof func == "function") {
        func(out)
    }
    return out
}

function renderObsidianCanvas(canvasData) {
    const colors = [
        'grey', 'red', 'orange', 'yellow', 'green', 'cyan', 'purple'
    ]

    const svg = createSVG("svg")
    let minX = Infinity
    let maxX = -Infinity
    let minY = Infinity
    let maxY = -Infinity
    for (const node of canvasData.nodes) {
        const w = node.width
        const h = node.height
        const x0 = node.x
        const x1 = node.x + w
        const y0 = node.y
        const y1 = node.y + h
        minX = Math.min(minX, Math.min(x0, x1))
        minY = Math.min(minY, Math.min(y0, y1))
        maxX = Math.max(maxX, Math.max(x0, x1))
        maxY = Math.max(maxY, Math.max(y0, y1))
        //console.log("node", x0, x1, y0, y1, w, h)
    }
    const canvasWidth = maxX - minX
    const canvasHeight = maxY - minY
    //console.log("BOUNDS:", "X=", canvasWidth, minX, maxX, "Y=", canvasHeight, minY, maxY)
    svg.width = canvasWidth
    svg.height = canvasHeight
    svg.style.width = `100%`
    //svg.style.width = `${canvasWidth}px`
    //svg.style.height = `${canvasHeight}px`
    svg.setAttribute("viewBox", `0 0 ${canvasWidth} ${canvasHeight}`)
    //svg.appendChild(createSVG("rect", it => {
    //    it.setAttribute("width", 100)
    //    it.setAttribute("height", 100)
    //}))

    const nodesById = new Map();
    for (const node of canvasData.nodes) {
        nodesById.set(node.id, node)
    }

    const converter = new showdown.Converter();

    function getHtmlColor(nodeColor) {
        const color = `${(nodeColor ?? 0)}`
        const htmlColor = (color.startsWith("#")) ? color : colors[color]
        return htmlColor
    }

    for (const node of canvasData.nodes) {
        if (node.type != "text") console.error("Unsupported type", node)
        svg.appendChild(createSVG("g", it => {
            it.setAttribute("transform", `translate(${+node.x - minX}, ${+node.y - minY})`)

            it.appendChild(createSVG("rect", it => {
                const color = getHtmlColor(node.color)
                it.setAttribute("width", node.width)
                it.setAttribute("height", node.height)
                it.setAttribute("rx", 15)
                it.setAttribute("fill", color)
                it.setAttribute("fill-opacity", 0.25)
                it.setAttribute("stroke", color)
                it.setAttribute("stroke-opacity", 0.75)
                it.setAttribute("stroke-width", 4)
            }))
            it.appendChild(createSVG("foreignObject", it => {
                it.setAttribute("width", node.width)
                it.setAttribute("height", node.height)
                const div = document.createElementNS("http://www.w3.org/1999/xhtml", "div")
                it.appendChild(div)
                div.style.textAlign = "left"
                div.style.margin = '17px'
                div.style.padding = '0'
                div.style.color = 'white'
                div.style.font = '19px Arial'
                div.innerHTML = converter.makeHtml(node.text)
            }))
        }));    
    }
    function adjustCoord(pos, node, side, padding) {
        switch (side) {
            case "left": return { x : pos.x - padding, y: pos.y + node.height / 2 }
            case "top": return { x : pos.x + node.width / 2, y: pos.y - padding }
            case "right": return { x : pos.x + node.width + padding, y: pos.y + node.height / 2 }
            case "bottom": return { x : pos.x + node.width / 2, y: pos.y + node.height + padding }
        }
        return pos
    }

    for (const edge of canvasData.edges) {
        const fromNode = nodesById.get(edge.fromNode)
        const toNode = nodesById.get(edge.toNode)
        if (!fromNode || !toNode) continue
        console.log(fromNode, toNode)
        const p0 = adjustCoord({ x: fromNode.x - minX, y: fromNode.y - minY }, fromNode, edge.fromSide, 4)
        const p1 = adjustCoord({ x: toNode.x - minX, y: toNode.y - minY }, toNode, edge.toSide, 10)
        const arrowColor = getHtmlColor(edge.color)
        svg.appendChild(createSVG("defs", it => {
            it.innerHTML = `
            <marker id='head${edge.id}' orient="auto"
                markerWidth='3' markerHeight='4'
                refX='0.1' refY='2'>
                <path d='M0,0 V4 L2,2 Z' fill="${arrowColor}"/>
            </marker>
            `
        }))
        svg.appendChild(createSVG("path", it => {
            it.id = "arrow-line"
            it.setAttribute("marker-end", `url(#head${edge.id})`)
            it.setAttribute("stroke-width", 4)
            it.setAttribute("stroke-linecap", 'round')
            it.setAttribute("fill", "none")
            it.setAttribute("stroke", arrowColor)
            it.setAttribute("d", `M${p0.x},${p0.y} ${p1.x},${p1.y}`)
        }))    
    }

    return svg
}

async function renderObsidianCanvasFromURL(url) {
    const data = await fetch(url)
    const json = await data.json()
    console.warn(json)
    return renderObsidianCanvas(json)
}

async function renderObsidianCanvasSelector(selector, url) {
    document.querySelector(selector)
        .appendChild(await renderObsidianCanvasFromURL(url))
}

// renderObsidianCanvasSelector("#test_container", "/roadmap/targets.canvas")
    //(async () => { document.querySelector("#test_container").appendChild(await renderObsidianCanvasFromURL("/roadmap/targets.canvas")) })()


document.addEventListener("DOMContentLoaded", async (event) => {
    for (const node of document.querySelectorAll('[data-obsidian-canvas]')) {
        const url = node.getAttribute('data-obsidian-canvas')
        node.appendChild(await renderObsidianCanvasFromURL(url))
    }
});
