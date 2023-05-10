export const geoData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Lviv-1",
        type: "offices",
      },
      geometry: {
        type: "Point",
        coordinates: [-104.99404, 39.75621],
      },
    },
    {
      type: "Feature",
      properties: {
        // name: "Busch Field",
        // show_on_map: true,
        name: "Kyiv-10",
        type: "offices",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-105.98404, 39.74621],
          [-102.98404, 30.74621],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Lviv-10",
        type: "offices",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-105.98404, 39.74621],
          [-102.98404, 30.74621],
        ],
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        // These coordinates outline Maine.
        coordinates: [
          [
            [-67.13734, 45.13745],
            [-66.96466, 44.8097],
            [-68.03252, 44.3252],
            [-69.06, 43.98],
            [-70.11617, 43.68405],
            [-70.64573, 43.09008],
            [-70.75102, 43.08003],
            [-70.79761, 43.21973],
            [-70.98176, 43.36789],
            [-70.94416, 43.46633],
            [-71.08482, 45.30524],
            [-70.66002, 45.46022],
            [-70.30495, 45.91479],
            [-70.00014, 46.69317],
            [-69.23708, 47.44777],
            [-68.90478, 47.18479],
            [-68.2343, 47.35462],
            [-67.79035, 47.06624],
            [-67.79141, 45.70258],
            [-67.13734, 45.13745],
          ],
        ],
      },
    },
  ],
};
