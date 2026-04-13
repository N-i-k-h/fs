import re

def get_center_v2(d):
    nums = [int(n) for n in re.findall(r'-?\d+', d)]
    if not nums: return None
    x_vals = nums[0::2]
    y_vals = nums[1::2]
    if not x_vals or not y_vals: return (0,0)
    return ((min(x_vals)+max(x_vals))/2, (min(y_vals)+max(y_vals))/2)

content = open(r"C:\Users\lenovo\Downloads\vkFHa01.svg").read()
all_paths = re.findall(r'<path[^>]*d="([^"]+)"', content, re.DOTALL)
all_polys = []
for d in all_paths:
    all_polys.extend([p.strip() for p in re.split(r'(?=M)', d) if p.strip()])

all_polys.sort(key=len, reverse=True)

# Revised Mapping based on spatial analysis and user feedback
# 0: Top, 1: SW, 2: Mid-East, 3: NW, 4: SE, 5: West, 6: South, 8: Far-East
region_ids = [
    ("byatarayanapura", 0),
    ("mahadevapura", 8),
    ("bommanahalli", 4),
    ("dasarahalli", 3),
    ("rr_nagar", 1),
    ("east", 2),
    ("south", 6),
    ("west", 5)
]

output = """import { cn } from "@/lib/utils";

interface MapProps {
    hoveredMarket: string | null;
    selectedMarket: string | null;
    onHover: (id: string | null) => void;
    onClick: (id: string) => void;
}

const BangaloreMap = ({ hoveredMarket, selectedMarket, onHover, onClick }: MapProps) => {
    
    const getPathClass = (id: string) => {
        const isActive = selectedMarket === id;
        const isHovered = hoveredMarket === id;
        
        return cn(
            "transition-all duration-500 cursor-pointer stroke-black/20 outline-none",
            isHovered ? "fill-teal stroke-black drop-shadow-xl scale-[1.01]" : 
            isActive ? "fill-teal stroke-black" :
            "fill-gray-50 stroke-black/10 hover:fill-gray-100"
        );
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center p-4 group/box">
            <svg 
                version="1.0" 
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 600 471"
                preserveAspectRatio="xMidYMid meet"
                className="w-full h-full max-h-[600px] transition-transform duration-700"
            >
                <g transform="translate(0.000000,471.000000) scale(0.100000,-0.100000)">
"""

# Render all regions
for rid, idx in region_ids:
    d = all_polys[idx]
    output += f'                    <path id="{rid}" d="{d}" \n'
    output += f'                         onMouseEnter={() => onHover("{rid}")}\n'
    output += f'                         onMouseLeave={() => onHover(null)}\n'
    output += f'                         onClick={() => onClick("{rid}")}\n'
    output += f'                         strokeWidth="8" \n'
    output += f'                         className={{getPathClass("{rid}")}} />\n'

# Render decorative paths
decoration_data = " ".join([all_polys[i] for i in range(len(all_polys)) if i not in [r[1] for r in region_ids] and len(all_polys[i]) > 30])
output += f'                    <path d="{decoration_data}" className="fill-gray-100/30 stroke-black/5 pointer-events-none" strokeWidth="2" />\n'

output += '                </g>\n'
output += '                {/* Labels */}\n'
for rid, idx in region_ids:
    p = all_polys[idx]
    c = get_center_v2(p)
    sx = c[0] * 0.1
    sy = 471 + (c[1] * -0.1)
    
    label_text = rid.replace('_', ' ').capitalize()
    if rid == "rr_nagar": label_text = "RR Nagar"
    
    # Adjust y for visibility if needed
    output += f'                <g className="pointer-events-none">\n'
    output += f'                    <text x="{sx:.1f}" y="{sy:.1f}" \n'
    output += f'                        textAnchor="middle" \n'
    output += f'                        className={{{{cn("text-[9px] font-black uppercase tracking-tighter transition-all duration-300", hoveredMarket === "{rid}" ? "fill-navy scale-110" : "fill-navy/40")}}}} \n'
    output += f'                        style={{{{ pointerEvents: "none" }}}}>\n'
    output += f'                        {label_text}\n'
    output += f'                    </text>\n'
    output += f'                </g>\n'

output += """            </svg>
        </div>
    );
};

export default BangaloreMap;
"""

with open(r"c:\Users\lenovo\OneDrive\Desktop\flickspacefrontend-master\src\components\BangaloreMap.tsx", "w") as f:
    f.write(output)

print("Map Re-mapped and Styled According to Exact Geometry")
