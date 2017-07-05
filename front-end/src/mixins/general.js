export default {
    methods: {

        /**
         * Emits event to close modal
         *
         * @param      {string}  modalId  The modal identifier
         */
        handleClose(modalId) {

            this.$root.$emit('hide::modal', modalId);

        },

        /**
         * Emits event to open modal
         *
         * @param      {string}  modalId  The modal identifier
         */
        handleOpen(modalId) {

            this.$root.$emit('show::modal', modalId);

        },

        /**
         * Sets details
         *
         * @param      {Object}  item    The item
         */
        handleDetails(item) {
            
            this.details = item;

        }

    }
};
