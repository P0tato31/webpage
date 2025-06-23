let imatgesPokemons = [];
let llistaPokemons = [];
let contenidorPokemons;

$(document).ready(function () {
    contenidorPokemons = $('.contenidor-pokemon');
    let nextUrl = "https://pokeapi.co/api/v2/pokemon?limit=1025";

    $.get(nextUrl, function (data) {
        data.results.forEach((pokemon, index) => {
            let id = index + 1;
            llistaPokemons.push({
                id,
                name: pokemon.name,
                url: pokemon.url
            });

            let spriteUrl = getSpriteUrl(id, pokemon.name);
            imatgesPokemons.push(`
                <div class="pokemon-card pokemon-img" data-id="${id}" data-url="${pokemon.url}">
                    <img 
                        src="${spriteUrl}" 
                        alt="${pokemon.name}" 
                        onerror="this.onerror=null; this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png';" 
                    />
                    <p>${pokemon.name}</p>
                </div>
            `);
        });
        contenidorPokemons.html(imatgesPokemons.join(""));
        afegirInteractivitat();
    });

    $("#search").on("input", function (event) {
        let query = event.target.value.toLowerCase().trim();
        if (query.length < 2) {
            contenidorPokemons.html(imatgesPokemons.join(""));
            afegirInteractivitat();
            return;
        }

        let coincidencies = llistaPokemons.filter(poke => obtenirCondicioCerca(poke, query));
        let llistaImatgesTrobades = coincidencies.map(poke => {
            let spriteUrl = getSpriteUrl(poke.id, poke.name);
            return `
                <div class="pokemon-card pokemon-img" data-id="${poke.id}" data-url="${poke.url}">
                    <img 
                        src="${spriteUrl}" 
                        alt="${poke.name}" 
                        onerror="this.onerror=null; this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png';" 
                    />
                    <p>${poke.name}</p>
                </div>
            `;
        });

        contenidorPokemons.html(llistaImatgesTrobades.join(""));
        afegirInteractivitat();
    });

    function getSpriteUrl(id, name) {
        if (id <= 649) {
            let idStr = id.toString().padStart(3, '0');
            return `https://projectpokemon.org/images/sprites-models/bw-animated/${idStr}.gif`;
        } else if (id >= 650 && id <= 890) {
            return `https://projectpokemon.org/images/normal-sprite/${name.toLowerCase()}.gif`;
        } else {
            return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
        }
    }

    function afegirInteractivitat() {
        $(".pokemon-img").off("click").on("click", function () {
            let id = $(this).data("id");
            let url = $(this).data("url");
            fetchPokemonDetails(url);

            let $informacio = $(".informacio");
            if (!isVisible($informacio[0])) {
                blurBackground(true);
                $informacio[0].style.display = "flex";
                $informacio[0].style.position = "fixed";
                $informacio[0].style.top = "50%";
                $informacio[0].style.left = "50%";
                $informacio[0].style.transform = "translate(-50%, -50%)";
                $informacio[0].style.zIndex = "9999";
            }
        });
    }

    function obtenirCondicioCerca(pokemon, query) {
        let tipusCerca = $("select").val();
        if (tipusCerca === "Nombre") {
            return pokemon.name.toLowerCase().startsWith(query);
        } else if (tipusCerca === "Número pokédex") {
            return pokemon.id.toString() === query;
        }
        return false;
    }

    function isVisible(elem) {
        return elem.offsetParent !== null;
    }

    function fetchPokemonDetails(url) {
        fetch(url)
            .then(response => response.json())
            .then(pokemon => {
                $('.pokemon-nom').text(pokemon.name);
                $('#tipus').text(pokemon.types.map(t => t.type.name).join(', '));
                $('#moviments').text(pokemon.moves.map(m => m.move.name).slice(0, 4).join(', '));

                let front = pokemon.sprites.front_default;
                let shinyFront = pokemon.sprites.front_shiny;
                let back = pokemon.sprites.back_default;
                let shinyBack = pokemon.sprites.back_shiny;

                let shiny = Math.floor(Math.random() * 4096) === 0;
                $('#pokemon-front').attr('src', shiny ? shinyFront : front);
                $('#pokemon-back').attr('src', shiny ? shinyBack : back);

                function toggleShiny() {
                    let isCurrentlyShiny = $('#pokemon-front').attr('src') === shinyFront;
                    $('#pokemon-front').attr('src', isCurrentlyShiny ? front : shinyFront);
                    $('#pokemon-back').attr('src', isCurrentlyShiny ? back : shinyBack);
                }

                $('#pokemon-front, #pokemon-back').off('dblclick').on('dblclick', toggleShiny);

                let totalstats = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
                $('#id').text(pokemon.id);
                $('#totalstats').text(totalstats);
                $('#height').text(pokemon.height);
                $('#weight').text(pokemon.weight);
                $('#hp').text(pokemon.stats[0].base_stat);
                $('#attack').text(pokemon.stats[1].base_stat);
                $('#defense').text(pokemon.stats[2].base_stat);
                $('#specialattack').text(pokemon.stats[3].base_stat);
                $('#specialdefense').text(pokemon.stats[4].base_stat);
                $('#speed').text(pokemon.stats[5].base_stat);
            });
    }
});