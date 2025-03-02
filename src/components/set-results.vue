<script setup>
    import { ref, onMounted } from 'vue';
    import * as Scry from "scryfall-sdk";

    const emit = defineEmits(['back']);
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

    const ignoredCards = ['Mountain', 'Forest', 'Island', 'Plains', 'Swamp']
    const ignoredSets = ['The List', 'Magic Online Promos']

    const innerList = ref([])
    const setLists = ref([])

    const parsing = ref(0)
    const failed = ref(0)
    const fails = ref([])
    const currentCard = ref('')
    const parsed = ref(0)

    function back() {
        emit('back')
    }

    async function parseCard(cardname, count = 1) {
        parsing.value = parsing.value + 1
        currentCard.value = cardname
        // ignores basic lands
        
            let card = undefined
            try {
                card = await Scry.Cards.byName(cardname)
            } catch(e) {
                parsing.value = parsing.value - 1
                failed.value = failed.value + 1
                fails.value.push(cardname)
                parsed.value = parsed.value + 1
                return undefined
            }
            let prints = undefined
            try {
                prints = await card.getPrints()
            } catch(e) {
                parsing.value = parsing.value - 1
                failed.value = failed.value + 1
                fails.value.push(cardname)
                console.log(cardname)
                parsed.value = parsed.value + 1
                return undefined
            }
            prints.forEach((print) => {
                const setname = print.set_name
                if (!ignoredSets.includes(setname)) {
                    let index = setLists.value.findIndex(s => s.name == setname);
                    if(index == -1) {
                        setLists.value.push({
                            name: setname,
                            cards: [cardname],
                            count,
                        })
                    } else if (!setLists.value[index].cards.includes(cardname)) {
                        setLists.value[index].cards.push(cardname)
                        setLists.value[index].count += count
                    }
                }
            })
        parsing.value = parsing.value - 1
        parsed.value = parsed.value + 1
    }

    onMounted(() => {
        innerList.value = props.decklist.split('\n').filter(n => n)
        innerList.value = innerList.value.filter((cardname) => {
            let innerName = cardname
            // removes card counts
            if (cardname.match(/^\d/)) {
                innerName = cardname.split(' ').slice(1).join(' ')
            }
            return !ignoredCards.includes(innerName) && (props.collection == undefined || !props.collection.includes(innerName))
        })
        innerList.value.forEach((cardname, i) => {
            let count = 1
            // removes card counts
            if (cardname.match(/^\d/)) {
                let words = cardname.split(' ')
                count = Number(words[0])
                cardname = words.slice(1).join(' ')
            }
            setTimeout(() => {
                
                parseCard(cardname, count).then(() => {
                    setLists.value = setLists.value.sort((a, b) => {
                        if (a.count > b.count) return -1
                        if (a.count < b.count) return 1
                        else return 0
                    })
                })
            }, 100 * i)
        })
    })
</script>

<template>
    <div>
        <p id="title" class="pt-4">Your Results</p>
        <v-row class="fix-width">
            <v-col cols="2" />
            <v-col cols="8">
                <p v-if="parsed < innerList.length" class="my-4 white-text"> Searching for {{ currentCard + (parsing > 1 ? ` and ${parsing} others` : '') }} ({{ innerList.length - parsed }} remaining)... </p>
                <p v-else-if="setLists.length == 0" class="my-4 white-text">No sets found.</p>
                <p v-else class="my-4 white-text"> Done. {{ failed }} Failure{{ failed == 1 ? '' : 's' }}{{ failed > 0 ? `: ${fails}` : '.' }} </p>
                <v-card v-if="setLists.length > 0" color="#555" class="my-4  setlists-card">
                    <v-card-text>
                        <v-card color="#777" v-for="set in setLists" :key="set.name" class="mb-4">
                            <v-card-text class="set-title">{{ set.name }} - {{ set.count }}</v-card-text>
                            <v-card-text class="cards-list pt-0">
                                <span v-for="(card, i) in set.cards" :key="`${set.name}-${card}`">{{ i > 0 ? `; ${card}` : card }}</span>
                            </v-card-text>
                        </v-card>
                    </v-card-text>
                </v-card>
                <v-card text color="transparent" flat>
                    <v-card-text class="d-flex align-center justify-start h-100 mb-4 py-0 pl-0 no-height">
                        <v-tooltip location="right">
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" color="red" @click="back" class="mb-4 no-uppercase">
                                    <v-icon class="mr-2">mdi-arrow-left</v-icon> Back To Decklist 
                                </v-btn>
                            </template>
                            Return to previous page
                        </v-tooltip>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="2" />
        </v-row>
    </div>
</template>

<style scoped>
.set-title {
    font-size: min(3vh, 3vw)
}
.cards-list {
    font-size: min(2vh, 3vw)
}
.setlists-card {
    max-height: 65vh;
    overflow: auto;
}
.no-height {
    max-height: 0px;
}
</style>
