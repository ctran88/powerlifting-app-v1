export default {
  methods: {

        /**
         * Emits event to close modal
         *
         * @param      {string}  modalId  The modal identifier
         */
    handleClose: function(modalId) {
      this.$root.$emit('hide::modal', modalId);
    },

        /**
         * Emits event to open modal
         *
         * @param      {string}  modalId  The modal identifier
         */
    handleOpen: function(modalId) {
      this.$root.$emit('show::modal', modalId);
    },

        /**
         * Sets details
         *
         * @param      {Object}  item    The item
         */
    handleDetails: function(item) {
      this.details = item;
    }

  }
};
