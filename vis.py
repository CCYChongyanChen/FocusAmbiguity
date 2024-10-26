import urllib.request
import numpy as np
import matplotlib.pyplot as plt
import urllib

segmentation = (
    [
        224.24,
        297.18,
        228.29,
        297.18,
        234.91,
        298.29,
        243.0,
        297.55,
        249.25,
        296.45,
        252.19,
        294.98,
        256.61,
        292.4,
        254.4,
        264.08,
        251.83,
        262.61,
        241.53,
        260.04,
        235.27,
        259.67,
        230.49,
        259.67,
        233.44,
        255.25,
        237.48,
        250.47,
        237.85,
        243.85,
        237.11,
        240.54,
        234.17,
        242.01,
        228.65,
        249.37,
        224.24,
        255.62,
        220.93,
        262.61,
        218.36,
        267.39,
        217.62,
        268.5,
        218.72,
        295.71,
        225.34,
        297.55,
    ],
)

print(segmentation[0][::2])
print(segmentation[0][1::2])

# show a image from online source
img = plt.imread("a.jpg")
plt.imshow(img)
plt.plot(segmentation[0][::2], segmentation[0][1::2], linewidth=2)
plt.show()