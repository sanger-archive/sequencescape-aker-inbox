const setLinkable = {
  methods: {
    createSetLink(setUuid) {
      return `${process.env.AKER_URL}/set/simple/sets/${setUuid}`;
    },
  },
};

export default setLinkable;
