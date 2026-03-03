// Section UI Metadata Registry
// This file contains the metadata for all section UI components
// It should be kept in sync with the frontend section-ui registry

export const SECTION_KEYS = {
  LANDING_CAROUSEL_V1: 'LANDING_CAROUSEL_V1',
} as const;

export type SectionKey = (typeof SECTION_KEYS)[keyof typeof SECTION_KEYS];

export const SECTION_METADATA = {
  [SECTION_KEYS.LANDING_CAROUSEL_V1]: {
    name: 'Banner',
    properties: {
      slides: {
        titleMain: null,
        titleHighlight: null,
        subTitle: null,
        imageUrl: null,
        alt: null,
        href: null,
      },
      showText: null,
      height: null,
      loop: null,
      orientation: null,
    },
  },
};
