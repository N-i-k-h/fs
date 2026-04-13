import re

def get_center_raw(d):
    nums = [int(n) for n in re.findall(r'-?\d+', d)]
    if not nums: return None
    y_vals = nums[1::2]
    return (sum(nums[0::2])/len(nums[0::2]), sum(nums[1::2])/len(nums[1::2]))

content = open(r"C:\Users\lenovo\Downloads\vkFHa01.svg").read()
all_paths = re.findall(r'<path[^>]*d="([^"]+)"', content, re.DOTALL)
all_polys = []
for d in all_paths:
    all_polys.extend([p.strip() for p in re.split(r'(?=M)', d) if p.strip()])

all_polys.sort(key=len, reverse=True)

print("ID | RAW_X | RAW_Y | LEN")
for i in range(12):
    p = all_polys[i]
    c = get_center_raw(p)
    print(f"{i} | {c[0]:.0f} | {c[1]:.0f} | {len(p)}")
