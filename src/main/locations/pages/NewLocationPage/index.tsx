// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  Button as MuiButton,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Header from "src/shared/ui/components/Header";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  FeatureGroup,
  Circle,
  GeoJSON,
  useMap,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import * as L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import Button from "src/shared/ui/Button";
import { useLeafletContext } from "@react-leaflet/core";
import Autocomplete from "@mui/material/Autocomplete";
import useApi from "src/shared/agent";
import { v4 as uuidv4 } from "uuid";
import { debounce } from "lodash";
import { VariantType, useSnackbar } from "notistack";

const CreateLocationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  address: Yup.string().required("Address is required"),
  type: Yup.string(),
});

const NewLocationPage = () => {
  const geoJSONRef = useRef(null);
  const featureGroupRef = useRef(null);
  let navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
  const [autocompleteValue, setAutocompleteValue] = useState<string | null>();
  const [isLocationSearch, setLocationSearch] = useState(false);
  const loading = open && options.length === 0;
  const { enqueueSnackbar } = useSnackbar();

  const { post } = useApi();

  const onSubmit = async (values: any, { resetForm }: any) => {
    const id = uuidv4();
    const requstData = {
      ...values,
      id,
      location: formatGeoJson(
        { name: values?.name, type: values?.type, id: id },
        featureGroupRef.current.toGeoJSON()
      ),
    };

    try {
      const response = await post("/locations", { location: requstData });
      if (response.status === 201) {
        enqueueSnackbar(`${requstData?.name} is successfully created.`, {
          variant: "success",
          anchorOrigin: { horizontal: "right", vertical: "top" },
        });

        resetForm();
        navigate(`/locations/${response.data?.data?.id}`);
      }
    } catch (error) {}
  };

  const formatGeoJson = (properties: any, geoJsonArray: any) => {
    const features = _.map(geoJsonArray?.features ?? [], (geoJson) => {
      geoJson.properties = properties;
      return geoJson;
    });
    return { ...geoJsonArray, features: features };
  };

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [autocompleteOptions, setAutocompleteOptions] =
    useState(autoCompleOpts);

  const debouncedSetAutocompleteValue = useRef(
    debounce((newValue) => {
      setAutocompleteValue(newValue);
    }, 1000)
  ).current;

  const handleAutocompleteChange = (event: any, newValue: string | null) => {
    debouncedSetAutocompleteValue.cancel();
    debouncedSetAutocompleteValue(newValue);
  };

  useEffect(() => {
    if (!autocompleteValue) return;
    var apiUrl =
      "https://api.opencagedata.com/geocode/v1/json?q=" +
      encodeURIComponent(autocompleteValue) +
      "&key=" +
      process.env.REACT_APP_OPEN_CAGE_API_KEY;

    fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        setAutocompleteOptions(data);
      });
  }, [autocompleteValue]);

  return (
    <Box m="20px">
      <Header title="NEW LOCATION" subtitle="Create New Location Page" />
      <Formik
        initialValues={{ name: "", address: "", type: " " }}
        validationSchema={CreateLocationSchema}
        onSubmit={onSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Box
              marginBottom="10px"
              display="flex"
              justifyContent="space-between"
              width="300px"
            >
              <Button type="submit" label="Create" />
              <Button label="Cancel" url="/locations" />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <TextField
                fullWidth
                variant="filled"
                label="Name"
                name="name"
                type="text"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Address"
                name="address"
                type="text"
                value={values.address}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.address && Boolean(errors.address)}
                helperText={touched.address && errors.address}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Type"
                name="type"
                type="text"
                value={values.type}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.type && Boolean(errors.type)}
                helperText={touched.type && errors.type}
                sx={{ gridColumn: "span 2" }}
              />

              <FormGroup>
                <Box
                  sx={{
                    // display: "flex",
                    alignItems: "center",
                    margin: "10px",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        defaultChecked
                        color="success"
                        checked={isLocationSearch}
                        onChange={(e) => {
                          return setLocationSearch(e?.target?.checked || false);
                        }}
                      />
                    }
                    label="Use Location Search"
                  />
                  {isLocationSearch && (
                    <Autocomplete
                      key={searchQuery}
                      id="asynchronous-demo"
                      sx={{ width: 300 }}
                      onOpen={() => {
                        setOpen(true);
                      }}
                      onChange={(event: any, newValue: string | null) => {
                        setAutocompleteValue(newValue);
                      }}
                      styles={{ marginTop: "10px" }}
                      onClose={() => {
                        setOpen(false);
                      }}
                      isOptionEqualToValue={(option, value) =>
                        option.formatted === value.formatted
                      }
                      getOptionLabel={(option) => option.formatted}
                      options={autocompleteOptions?.results ?? []}
                      onInputChange={handleAutocompleteChange}
                      loading={loading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Locations"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {loading ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                    />
                  )}
                </Box>
              </FormGroup>

              <Box height="80%">
                <MapContainer
                  center={[45.2595092, -104.5204334]}
                  zoom={3}
                  style={{ height: "60vh" }}
                >
                  <FeatureGroup ref={featureGroupRef}>
                    <EditControl
                      position="topright"
                      draw={{
                        rectangle: false,
                        circle: false,
                        circlemarker: false,
                      }}
                    />

                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                  </FeatureGroup>

                  <MapZoomToLocation
                    lon={autocompleteValue?.geometry?.lng}
                    lat={autocompleteValue?.geometry?.lat}
                    zoomLevel={16}
                  />
                </MapContainer>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

const MapZoomToLocation = ({ lon, lat, zoomLevel }) => {
  const map = useMap();

  useEffect(() => {
    if (lon && lat) {
      map.flyTo([lat, lon], zoomLevel, {
        animate: true,
        duration: 2.5,
      });
    }
  }, [map, lon, lat, zoomLevel]);

  return null;
};

const autoCompleOpts = {
  documentation: "https://opencagedata.com/api",
  licenses: [
    {
      name: "see attribution guide",
      url: "https://opencagedata.com/credits",
    },
  ],
  rate: {
    limit: 2500,
    remaining: 2498,
    reset: 1683763200,
  },
  results: [
    {
      annotations: {
        DMS: {
          lat: "49° 50' 31.02720'' N",
          lng: "24° 1' 53.73156'' E",
        },
        MGRS: "35UKR8658225285",
        Maidenhead: "KN29au32sb",
        Mercator: {
          x: 2675184.596,
          y: 6386274.452,
        },
        OSM: {
          edit_url:
            "https://www.openstreetmap.org/edit?relation=2032280#map=17/49.84195/24.03159",
          note_url:
            "https://www.openstreetmap.org/note/new#map=17/49.84195/24.03159&layers=N",
          url: "https://www.openstreetmap.org/?mlat=49.84195&mlon=24.03159#map=17/49.84195/24.03159",
        },
        UN_M49: {
          regions: {
            EASTERN_EUROPE: "151",
            EUROPE: "150",
            UA: "804",
            WORLD: "001",
          },
          statistical_groupings: ["LEDC"],
        },
        callingcode: 380,
        currency: {
          alternate_symbols: [],
          decimal_mark: ".",
          format: "%n %u",
          html_entity: "&#x20B4;",
          iso_code: "UAH",
          iso_numeric: "980",
          name: "Ukrainian Hryvnia",
          smallest_denomination: 1,
          subunit: "Kopiyka",
          subunit_to_unit: 100,
          symbol: "₴",
          symbol_first: 0,
          thousands_separator: ",",
        },
        flag: "🇺🇦",
        geohash: "u8c5dc7q2tmbep801f2g",
        qibla: 150.57,
        roadinfo: {
          drive_on: "right",
          speed_in: "km/h",
        },
        sun: {
          rise: {
            apparent: 1683686880,
            astronomical: 1683677820,
            civil: 1683684600,
            nautical: 1683681600,
          },
          set: {
            apparent: 1683741240,
            astronomical: 1683750360,
            civil: 1683743520,
            nautical: 1683746520,
          },
        },
        timezone: {
          name: "Europe/Kyiv",
          now_in_dst: 1,
          offset_sec: 10800,
          offset_string: "+0300",
          short_name: "EEST",
        },
        what3words: {
          words: "august.losing.droplet",
        },
        wikidata: "Q36036",
      },
      bounds: {
        northeast: {
          lat: 49.9037122,
          lng: 24.1334136,
        },
        southwest: {
          lat: 49.7681748,
          lng: 23.8980549,
        },
      },
      components: {
        "ISO_3166-1_alpha-2": "UA",
        "ISO_3166-1_alpha-3": "UKR",
        "ISO_3166-2": ["UA-46"],
        _category: "place",
        _type: "city",
        city: "Lviv",
        continent: "Europe",
        country: "Ukraine",
        country_code: "ua",
        district: "Lviv Raion",
        municipality: "Lviv Urban Hromada",
        state: "Lviv Oblast",
      },
      confidence: 5,
      formatted: "Lviv, Lviv Raion, Ukraine",
      geometry: {
        lat: 49.841952,
        lng: 24.0315921,
      },
    },
    {
      annotations: {
        DMS: {
          lat: "49° 39' 4.40424'' N",
          lng: "23° 49' 36.10128'' E",
        },
        MGRS: "34UGA0402903690",
        Maidenhead: "KN19vp96eh",
        Mercator: {
          x: 2652375.532,
          y: 6353508.634,
        },
        OSM: {
          edit_url:
            "https://www.openstreetmap.org/edit?relation=72380#map=17/49.65122/23.82669",
          note_url:
            "https://www.openstreetmap.org/note/new#map=17/49.65122/23.82669&layers=N",
          url: "https://www.openstreetmap.org/?mlat=49.65122&mlon=23.82669#map=17/49.65122/23.82669",
        },
        UN_M49: {
          regions: {
            EASTERN_EUROPE: "151",
            EUROPE: "150",
            UA: "804",
            WORLD: "001",
          },
          statistical_groupings: ["LEDC"],
        },
        callingcode: 380,
        currency: {
          alternate_symbols: [],
          decimal_mark: ".",
          format: "%n %u",
          html_entity: "&#x20B4;",
          iso_code: "UAH",
          iso_numeric: "980",
          name: "Ukrainian Hryvnia",
          smallest_denomination: 1,
          subunit: "Kopiyka",
          subunit_to_unit: 100,
          symbol: "₴",
          symbol_first: 0,
          thousands_separator: ",",
        },
        flag: "🇺🇦",
        geohash: "u8bfqnwp64zk6fpw5rf9",
        qibla: 150.06,
        roadinfo: {
          drive_on: "right",
          speed_in: "km/h",
        },
        sun: {
          rise: {
            apparent: 1683686940,
            astronomical: 1683678000,
            civil: 1683684720,
            nautical: 1683681720,
          },
          set: {
            apparent: 1683741240,
            astronomical: 1683750240,
            civil: 1683743520,
            nautical: 1683746460,
          },
        },
        timezone: {
          name: "Europe/Kyiv",
          now_in_dst: 1,
          offset_sec: 10800,
          offset_string: "+0300",
          short_name: "EEST",
        },
        what3words: {
          words: "vase.pursuits.gestation",
        },
        wikidata: "Q164193",
      },
      bounds: {
        northeast: {
          lat: 50.6489605,
          lng: 25.4270223,
        },
        southwest: {
          lat: 48.7182803,
          lng: 22.6408214,
        },
      },
      components: {
        "ISO_3166-1_alpha-2": "UA",
        "ISO_3166-1_alpha-3": "UKR",
        "ISO_3166-2": ["UA-46"],
        _category: "place",
        _type: "state",
        continent: "Europe",
        country: "Ukraine",
        country_code: "ua",
        state: "Lviv Oblast",
      },
      confidence: 1,
      formatted: "Lviv Oblast, Ukraine",
      geometry: {
        lat: 49.6512234,
        lng: 23.8266948,
      },
    },
    {
      annotations: {
        DMS: {
          lat: "47° 51' 41.72760'' N",
          lng: "33° 33' 5.61240'' E",
        },
        MGRS: "36TWU4125301064",
        Maidenhead: "KN67su66es",
        Mercator: {
          x: 3734942.463,
          y: 6052158.941,
        },
        OSM: {
          edit_url:
            "https://www.openstreetmap.org/edit?way=150913538#map=17/47.86159/33.55156",
          note_url:
            "https://www.openstreetmap.org/note/new#map=17/47.86159/33.55156&layers=N",
          url: "https://www.openstreetmap.org/?mlat=47.86159&mlon=33.55156#map=17/47.86159/33.55156",
        },
        UN_M49: {
          regions: {
            EASTERN_EUROPE: "151",
            EUROPE: "150",
            UA: "804",
            WORLD: "001",
          },
          statistical_groupings: ["LEDC"],
        },
        callingcode: 380,
        currency: {
          alternate_symbols: [],
          decimal_mark: ".",
          format: "%n %u",
          html_entity: "&#x20B4;",
          iso_code: "UAH",
          iso_numeric: "980",
          name: "Ukrainian Hryvnia",
          smallest_denomination: 1,
          subunit: "Kopiyka",
          subunit_to_unit: 100,
          symbol: "₴",
          symbol_first: 0,
          thousands_separator: ",",
        },
        flag: "🇺🇦",
        geohash: "u8xb72zmzzpxjr1dzu69",
        qibla: 167.01,
        roadinfo: {
          drive_on: "right",
          speed_in: "km/h",
        },
        sun: {
          rise: {
            apparent: 1683684960,
            astronomical: 1683763140,
            civil: 1683682800,
            nautical: 1683680040,
          },
          set: {
            apparent: 1683738540,
            astronomical: 1683746820,
            civil: 1683740700,
            nautical: 1683743460,
          },
        },
        timezone: {
          name: "Europe/Kyiv",
          now_in_dst: 1,
          offset_sec: 10800,
          offset_string: "+0300",
          short_name: "EEST",
        },
        what3words: {
          words: "parents.slandering.matchbox",
        },
        wikidata: "Q4270985",
      },
      bounds: {
        northeast: {
          lat: 47.8672822,
          lng: 33.5569365,
        },
        southwest: {
          lat: 47.8545944,
          lng: 33.5473084,
        },
      },
      components: {
        "ISO_3166-1_alpha-2": "UA",
        "ISO_3166-1_alpha-3": "UKR",
        "ISO_3166-2": ["UA-12"],
        _category: "place",
        _type: "village",
        continent: "Europe",
        country: "Ukraine",
        country_code: "ua",
        district: "Kryvyi Rih Raion",
        municipality: "Новопільська сільська громада",
        postcode: "53080",
        state: "Dnipropetrovsk Oblast",
        village: "Lviv",
      },
      confidence: 8,
      formatted:
        "Kryvyi Rih Raion, Lviv, Dnipropetrovsk Oblast, 53080, Ukraine",
      geometry: {
        lat: 47.861591,
        lng: 33.551559,
      },
    },
    {
      annotations: {
        DMS: {
          lat: "47° 53' 32.23284'' N",
          lng: "31° 5' 28.71960'' E",
        },
        MGRS: "36TUU5732606091",
        Maidenhead: "KN57nv04wd",
        Mercator: {
          x: 3461068.909,
          y: 6057238.105,
        },
        OSM: {
          edit_url:
            "https://www.openstreetmap.org/edit?node=337666775#map=17/47.89229/31.09131",
          note_url:
            "https://www.openstreetmap.org/note/new#map=17/47.89229/31.09131&layers=N",
          url: "https://www.openstreetmap.org/?mlat=47.89229&mlon=31.09131#map=17/47.89229/31.09131",
        },
        UN_M49: {
          regions: {
            EASTERN_EUROPE: "151",
            EUROPE: "150",
            UA: "804",
            WORLD: "001",
          },
          statistical_groupings: ["LEDC"],
        },
        callingcode: 380,
        currency: {
          alternate_symbols: [],
          decimal_mark: ".",
          format: "%n %u",
          html_entity: "&#x20B4;",
          iso_code: "UAH",
          iso_numeric: "980",
          name: "Ukrainian Hryvnia",
          smallest_denomination: 1,
          subunit: "Kopiyka",
          subunit_to_unit: 100,
          symbol: "₴",
          symbol_first: 0,
          thousands_separator: ",",
        },
        flag: "🇺🇦",
        geohash: "u8w07w80b13g3ktqcqfx",
        qibla: 162.1,
        roadinfo: {
          drive_on: "right",
          speed_in: "km/h",
        },
        sun: {
          rise: {
            apparent: 1683685560,
            astronomical: 1683677340,
            civil: 1683683400,
            nautical: 1683680640,
          },
          set: {
            apparent: 1683739140,
            astronomical: 1683747480,
            civil: 1683741300,
            nautical: 1683744060,
          },
        },
        timezone: {
          name: "Europe/Kyiv",
          now_in_dst: 1,
          offset_sec: 10800,
          offset_string: "+0300",
          short_name: "EEST",
        },
        what3words: {
          words: "clifftop.reservoir.goddesses",
        },
        wikidata: "Q4270987",
      },
      bounds: {
        northeast: {
          lat: 47.9122869,
          lng: 31.111311,
        },
        southwest: {
          lat: 47.8722869,
          lng: 31.071311,
        },
      },
      components: {
        "ISO_3166-1_alpha-2": "UA",
        "ISO_3166-1_alpha-3": "UKR",
        "ISO_3166-2": ["UA-48"],
        _category: "place",
        _type: "village",
        continent: "Europe",
        country: "Ukraine",
        country_code: "ua",
        district: "Pervomaisk Raion",
        municipality: "Мигіївська сільська громада",
        postcode: "55270",
        state: "Mykolaiv Oblast",
        village: "Lviv",
      },
      confidence: 7,
      formatted: "Pervomaisk Raion, Lviv, Mykolaiv Oblast, 55270, Ukraine",
      geometry: {
        lat: 47.8922869,
        lng: 31.091311,
      },
    },
    {
      annotations: {
        DMS: {
          lat: "45° 15' 38.16144'' N",
          lng: "35° 28' 23.57184'' E",
        },
        MGRS: "36TXR9404114876",
        Maidenhead: "KN75rg62sn",
        Mercator: {
          x: 3948860.164,
          y: 5632278.373,
        },
        OSM: {
          edit_url:
            "https://www.openstreetmap.org/edit?way=30711825#map=17/45.26060/35.47321",
          note_url:
            "https://www.openstreetmap.org/note/new#map=17/45.26060/35.47321&layers=N",
          url: "https://www.openstreetmap.org/?mlat=45.26060&mlon=35.47321#map=17/45.26060/35.47321",
        },
        UN_M49: {
          regions: {
            EASTERN_EUROPE: "151",
            EUROPE: "150",
            RU: "643",
            WORLD: "001",
          },
          statistical_groupings: ["MEDC"],
        },
        callingcode: 7,
        currency: {
          alternate_symbols: ["руб.", "р."],
          decimal_mark: ",",
          format: "%n %u",
          html_entity: "&#x20BD;",
          iso_code: "RUB",
          iso_numeric: "643",
          name: "Russian Ruble",
          smallest_denomination: 1,
          subunit: "Kopeck",
          subunit_to_unit: 100,
          symbol: "₽",
          symbol_first: 0,
          thousands_separator: ".",
        },
        flag: "🇷🇺",
        geohash: "ub11rpqy1g3vcnj8qnb8",
        qibla: 170.04,
        roadinfo: {
          drive_on: "right",
          speed_in: "km/h",
        },
        sun: {
          rise: {
            apparent: 1683684960,
            astronomical: 1683677520,
            civil: 1683682980,
            nautical: 1683680400,
          },
          set: {
            apparent: 1683737640,
            astronomical: 1683745140,
            civil: 1683739620,
            nautical: 1683742200,
          },
        },
        timezone: {
          name: "Europe/Simferopol",
          now_in_dst: 0,
          offset_sec: 10800,
          offset_string: "+0300",
          short_name: "MSK",
        },
        what3words: {
          words: "ranting.pledge.resignedly",
        },
        wikidata: "Q4271026",
      },
      bounds: {
        northeast: {
          lat: 45.2626288,
          lng: 35.4752521,
        },
        southwest: {
          lat: 45.2597395,
          lng: 35.4696603,
        },
      },
      components: {
        "ISO_3166-1_alpha-2": "RU",
        "ISO_3166-1_alpha-3": "RUS",
        _category: "place",
        _type: "hamlet",
        continent: "Europe",
        country: "Russia",
        country_code: "ru",
        hamlet: "Lvove",
        municipality: "Семисотское сельское поселение",
        region: "Southern Federal District",
        state: "Republic of Crimea",
      },
      confidence: 9,
      formatted:
        "Lvove, Семисотское сельское поселение, Republic of Crimea, Russia",
      geometry: {
        lat: 45.2606004,
        lng: 35.4732144,
      },
    },
    {
      annotations: {
        DMS: {
          lat: "49° 50' 29.68692'' N",
          lng: "24° 1' 58.55160'' E",
        },
        MGRS: "35UKR8667625240",
        Maidenhead: "KN29au31wx",
        Mercator: {
          x: 2675333.641,
          y: 6386210.367,
        },
        OSM: {
          edit_url:
            "https://www.openstreetmap.org/edit?node=3640987781#map=17/49.84158/24.03293",
          note_url:
            "https://www.openstreetmap.org/note/new#map=17/49.84158/24.03293&layers=N",
          url: "https://www.openstreetmap.org/?mlat=49.84158&mlon=24.03293#map=17/49.84158/24.03293",
        },
        UN_M49: {
          regions: {
            EASTERN_EUROPE: "151",
            EUROPE: "150",
            UA: "804",
            WORLD: "001",
          },
          statistical_groupings: ["LEDC"],
        },
        callingcode: 380,
        currency: {
          alternate_symbols: [],
          decimal_mark: ".",
          format: "%n %u",
          html_entity: "&#x20B4;",
          iso_code: "UAH",
          iso_numeric: "980",
          name: "Ukrainian Hryvnia",
          smallest_denomination: 1,
          subunit: "Kopiyka",
          subunit_to_unit: 100,
          symbol: "₴",
          symbol_first: 0,
          thousands_separator: ",",
        },
        flag: "🇺🇦",
        geohash: "u8c5dckhpzu5ykhg98z8",
        qibla: 150.57,
        roadinfo: {
          drive_on: "right",
          road: "Ruska Street",
          speed_in: "km/h",
        },
        sun: {
          rise: {
            apparent: 1683686880,
            astronomical: 1683677820,
            civil: 1683684600,
            nautical: 1683681600,
          },
          set: {
            apparent: 1683741240,
            astronomical: 1683750360,
            civil: 1683743520,
            nautical: 1683746520,
          },
        },
        timezone: {
          name: "Europe/Kyiv",
          now_in_dst: 1,
          offset_sec: 10800,
          offset_string: "+0300",
          short_name: "EEST",
        },
        what3words: {
          words: "voucher.sharpens.pits",
        },
      },
      bounds: {
        northeast: {
          lat: 49.8416297,
          lng: 24.032981,
        },
        southwest: {
          lat: 49.8415297,
          lng: 24.032881,
        },
      },
      components: {
        "ISO_3166-1_alpha-2": "UA",
        "ISO_3166-1_alpha-3": "UKR",
        "ISO_3166-2": ["UA-46"],
        _category: "financial",
        _type: "bank",
        bank: "Львів",
        borough: "Halytskyi District",
        city: "Lviv",
        continent: "Europe",
        country: "Ukraine",
        country_code: "ua",
        district: "Lviv Raion",
        municipality: "Lviv Urban Hromada",
        neighbourhood: "Хорущина",
        postcode: "79008",
        road: "Ruska Street",
        state: "Lviv Oblast",
      },
      confidence: 9,
      formatted:
        "Львів, Ruska Street, Lviv Raion, Lviv, Lviv Oblast, 79008, Ukraine",
      geometry: {
        lat: 49.8415797,
        lng: 24.032931,
      },
    },
    {
      annotations: {
        DMS: {
          lat: "49° 50' 8.62440'' N",
          lng: "24° 1' 55.01640'' E",
        },
        MGRS: "35UKR8658024592",
        Maidenhead: "KN29au30un",
        Mercator: {
          x: 2675224.325,
          y: 6385203.337,
        },
        OSM: {
          edit_url:
            "https://www.openstreetmap.org/edit?node=7670790345#map=17/49.83573/24.03195",
          note_url:
            "https://www.openstreetmap.org/note/new#map=17/49.83573/24.03195&layers=N",
          url: "https://www.openstreetmap.org/?mlat=49.83573&mlon=24.03195#map=17/49.83573/24.03195",
        },
        UN_M49: {
          regions: {
            EASTERN_EUROPE: "151",
            EUROPE: "150",
            UA: "804",
            WORLD: "001",
          },
          statistical_groupings: ["LEDC"],
        },
        callingcode: 380,
        currency: {
          alternate_symbols: [],
          decimal_mark: ".",
          format: "%n %u",
          html_entity: "&#x20B4;",
          iso_code: "UAH",
          iso_numeric: "980",
          name: "Ukrainian Hryvnia",
          smallest_denomination: 1,
          subunit: "Kopiyka",
          subunit_to_unit: 100,
          symbol: "₴",
          symbol_first: 0,
          thousands_separator: ",",
        },
        flag: "🇺🇦",
        geohash: "u8c5db7d0vpznfyzwxv0",
        qibla: 150.56,
        roadinfo: {
          drive_on: "right",
          road: "Tarasa Shevchenka Avenue",
          speed_in: "km/h",
        },
        sun: {
          rise: {
            apparent: 1683686880,
            astronomical: 1683677880,
            civil: 1683684600,
            nautical: 1683681600,
          },
          set: {
            apparent: 1683741240,
            astronomical: 1683750360,
            civil: 1683743520,
            nautical: 1683746520,
          },
        },
        timezone: {
          name: "Europe/Kyiv",
          now_in_dst: 1,
          offset_sec: 10800,
          offset_string: "+0300",
          short_name: "EEST",
        },
        what3words: {
          words: "hairstyle.wolf.materials",
        },
      },
      bounds: {
        northeast: {
          lat: 49.835779,
          lng: 24.031999,
        },
        southwest: {
          lat: 49.835679,
          lng: 24.031899,
        },
      },
      components: {
        "ISO_3166-1_alpha-2": "UA",
        "ISO_3166-1_alpha-3": "UKR",
        "ISO_3166-2": ["UA-46"],
        _category: "financial",
        _type: "bank",
        bank: "Львів",
        borough: "Halytskyi District",
        city: "Lviv",
        continent: "Europe",
        country: "Ukraine",
        country_code: "ua",
        district: "Lviv Raion",
        house_number: "28",
        municipality: "Lviv Urban Hromada",
        neighbourhood: "Хорущина",
        postcode: "79005",
        road: "Tarasa Shevchenka Avenue",
        state: "Lviv Oblast",
        suburb: "Штіллерівка",
      },
      confidence: 9,
      formatted:
        "Львів, Tarasa Shevchenka Avenue, 28, Штіллерівка, Lviv, Lviv Oblast, 79005, Ukraine",
      geometry: {
        lat: 49.835729,
        lng: 24.031949,
      },
    },
    {
      annotations: {
        DMS: {
          lat: "49° 50' 45.76380'' N",
          lng: "24° 1' 30.53640'' E",
        },
        MGRS: "35UKR8613725758",
        Maidenhead: "KN29au33ab",
        Mercator: {
          x: 2674467.353,
          y: 6386979.109,
        },
        OSM: {
          edit_url:
            "https://www.openstreetmap.org/edit?node=6388181541#map=17/49.84605/24.02515",
          note_url:
            "https://www.openstreetmap.org/note/new#map=17/49.84605/24.02515&layers=N",
          url: "https://www.openstreetmap.org/?mlat=49.84605&mlon=24.02515#map=17/49.84605/24.02515",
        },
        UN_M49: {
          regions: {
            EASTERN_EUROPE: "151",
            EUROPE: "150",
            UA: "804",
            WORLD: "001",
          },
          statistical_groupings: ["LEDC"],
        },
        callingcode: 380,
        currency: {
          alternate_symbols: [],
          decimal_mark: ".",
          format: "%n %u",
          html_entity: "&#x20B4;",
          iso_code: "UAH",
          iso_numeric: "980",
          name: "Ukrainian Hryvnia",
          smallest_denomination: 1,
          subunit: "Kopiyka",
          subunit_to_unit: 100,
          symbol: "₴",
          symbol_first: 0,
          thousands_separator: ",",
        },
        flag: "🇺🇦",
        geohash: "u8c5ddnw683e2thxnbm0",
        qibla: 150.56,
        roadinfo: {
          drive_on: "right",
          road: "Viacheslava Chornovola Avenue",
          speed_in: "km/h",
        },
        sun: {
          rise: {
            apparent: 1683686880,
            astronomical: 1683677820,
            civil: 1683684600,
            nautical: 1683681600,
          },
          set: {
            apparent: 1683741240,
            astronomical: 1683750360,
            civil: 1683743520,
            nautical: 1683746520,
          },
        },
        timezone: {
          name: "Europe/Kyiv",
          now_in_dst: 1,
          offset_sec: 10800,
          offset_string: "+0300",
          short_name: "EEST",
        },
        what3words: {
          words: "outsiders.fillings.contact",
        },
      },
      bounds: {
        northeast: {
          lat: 49.8460955,
          lng: 24.025199,
        },
        southwest: {
          lat: 49.8459955,
          lng: 24.025099,
        },
      },
      components: {
        "ISO_3166-1_alpha-2": "UA",
        "ISO_3166-1_alpha-3": "UKR",
        "ISO_3166-2": ["UA-46"],
        _category: "commerce",
        _type: "restaurant",
        borough: "Halytskyi District",
        city: "Lviv",
        continent: "Europe",
        country: "Ukraine",
        country_code: "ua",
        district: "Lviv Raion",
        house_number: "7",
        municipality: "Lviv Urban Hromada",
        postcode: "79007",
        restaurant: "Львів",
        road: "Viacheslava Chornovola Avenue",
        state: "Lviv Oblast",
      },
      confidence: 9,
      formatted:
        "Львів, Viacheslava Chornovola Avenue, 7, Lviv Raion, Lviv, Lviv Oblast, 79007, Ukraine",
      geometry: {
        lat: 49.8460455,
        lng: 24.025149,
      },
    },
    {
      annotations: {
        DMS: {
          lat: "47° 52' 1.63992'' N",
          lng: "33° 32' 55.31100'' E",
        },
        MGRS: "36TWU4103501677",
        Maidenhead: "KN67su58uc",
        Mercator: {
          x: 3734623.922,
          y: 6053073.949,
        },
        OSM: {
          edit_url:
            "https://www.openstreetmap.org/edit?node=7555515181#map=17/47.86712/33.54870",
          note_url:
            "https://www.openstreetmap.org/note/new#map=17/47.86712/33.54870&layers=N",
          url: "https://www.openstreetmap.org/?mlat=47.86712&mlon=33.54870#map=17/47.86712/33.54870",
        },
        UN_M49: {
          regions: {
            EASTERN_EUROPE: "151",
            EUROPE: "150",
            UA: "804",
            WORLD: "001",
          },
          statistical_groupings: ["LEDC"],
        },
        callingcode: 380,
        currency: {
          alternate_symbols: [],
          decimal_mark: ".",
          format: "%n %u",
          html_entity: "&#x20B4;",
          iso_code: "UAH",
          iso_numeric: "980",
          name: "Ukrainian Hryvnia",
          smallest_denomination: 1,
          subunit: "Kopiyka",
          subunit_to_unit: 100,
          symbol: "₴",
          symbol_first: 0,
          thousands_separator: ",",
        },
        flag: "🇺🇦",
        geohash: "u8xb73vqjq3fp78jt0g6",
        qibla: 167.01,
        roadinfo: {
          drive_on: "right",
          road: "С040513",
          speed_in: "km/h",
        },
        sun: {
          rise: {
            apparent: 1683684960,
            astronomical: 1683763140,
            civil: 1683682800,
            nautical: 1683680040,
          },
          set: {
            apparent: 1683738540,
            astronomical: 1683746820,
            civil: 1683740700,
            nautical: 1683743460,
          },
        },
        timezone: {
          name: "Europe/Kyiv",
          now_in_dst: 1,
          offset_sec: 10800,
          offset_string: "+0300",
          short_name: "EEST",
        },
        what3words: {
          words: "thesis.slanders.hiding",
        },
      },
      bounds: {
        northeast: {
          lat: 47.8671722,
          lng: 33.5487475,
        },
        southwest: {
          lat: 47.8670722,
          lng: 33.5486475,
        },
      },
      components: {
        "ISO_3166-1_alpha-2": "UA",
        "ISO_3166-1_alpha-3": "UKR",
        "ISO_3166-2": ["UA-12"],
        _category: "travel/tourism",
        _type: "information",
        borough: "Довгинцівський район",
        continent: "Europe",
        country: "Ukraine",
        country_code: "ua",
        district: "Kryvyi Rih Raion",
        information: "Львів",
        municipality: "Новопільська сільська громада",
        postcode: "53080",
        road: "С040513",
        state: "Dnipropetrovsk Oblast",
        village: "Lviv",
      },
      confidence: 9,
      formatted:
        "Львів, С040513, Kryvyi Rih Raion, Lviv, Dnipropetrovsk Oblast, 53080, Ukraine",
      geometry: {
        lat: 47.8671222,
        lng: 33.5486975,
      },
    },
  ],
  status: {
    code: 200,
    message: "OK",
  },
  stay_informed: {
    blog: "https://blog.opencagedata.com",
    mastodon: "https://en.osm.town/@opencage",
    twitter: "https://twitter.com/OpenCage",
  },
  thanks: "For using an OpenCage API",
  timestamp: {
    created_http: "Wed, 10 May 2023 12:54:49 GMT",
    created_unix: 1683723289,
  },
  total_results: 9,
};
export default NewLocationPage;
