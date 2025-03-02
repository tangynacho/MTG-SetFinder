<script setup>
    import { ref, onMounted } from 'vue'

    const emit = defineEmits(['submit']);
    const props = defineProps({
        decklist: {
            type: String,
            required: true,
        },
        collection: {
            type: Array,
            required: true,
        },
    })

    const innerList = ref('')
    const innerCollection = ref([])

    function submit() {
        emit('submit', {
            list: innerList.value,
            collection: innerCollection.value
        })
    }

    function updateCollection(input) {
        let list = input.split('\n')
        list.forEach((row, i) => {
            list[i] = String(row.split(',')[2]).split('\"')[1]
        })
        list.shift()
        list = list.filter((e) => e !== undefined)
        innerCollection.value = list
    }

    onMounted(() => {
        innerList.value = props.decklist
        innerCollection.value = props.collection
        let fileSelector = document.getElementById("load")
        if (fileSelector) {
        fileSelector.addEventListener("change", event => {
            let file = fileSelector.files[0]
            let reader = new FileReader()
            reader.onload = e => {
                let result = e.target.result
                // read result as csv and parse out collection
                updateCollection(result)
            };
            reader.readAsText(file);
        });
        }
    })
</script>

<template>
    <div>
        <p id="title" class="pt-4 mx-4">MTG Set Finder</p>
        <v-row class="fix-width">
            <v-col cols="2" />
            <v-col cols="8">
                <v-card text color="transparent" flat class="pa-0 ma-0">
                    <v-card-text class="d-flex align-center justify-end pa-0 ma-0">
                        <input
                            type="file"
                            accept=".csv"
                            name="load"
                            id="load"
                            class="inputfile"
                        />
                        <label title="Load A Collection from a CSV file" for="load" class="white-text pr-1">
                            {{innerCollection.length > 0 ? 'Collection Uploaded' : 'Upload Collection'}} 
                            <v-icon v-if="innerCollection.length <= 0"> mdi-upload </v-icon>
                            <v-icon v-else>mdi-check</v-icon>
                        </label>
                    </v-card-text>
                </v-card>
                <v-card color="#555" class="my-4">
                    <v-card-text class="input-prompt">Find sets that contain your cards. Enter one card per line:</v-card-text>
                    <v-textarea clearable no-resize auto-grow class="text-input mx-4" v-model="innerList"/>
                    <v-card-text class="d-flex align-center justify-end h-100">
                        <v-tooltip location="left">
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" color="green" @click="submit" class="no-uppercase">
                                    Find Sets <v-icon class="ml-2"> mdi-arrow-right </v-icon>
                                </v-btn>
                            </template>
                            Search for sets with your cards
                        </v-tooltip>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="2" />
        </v-row>
    </div>
</template>

<style scoped>
.input-prompt {
    font-size: min(3vw, 2vh);
}
.text-input {
    background-color: white;
    color: black;
    max-height: 60vh;
    overflow: auto;
}
.inputfile {
  opacity: 0;
  overflow: hidden;
  z-index: -1;
  width: 0px;
}
.inputfile + label {
  cursor: pointer;
  font-weight: bold;
  padding-left: 20px;
  padding-right: 30px;
}
</style>