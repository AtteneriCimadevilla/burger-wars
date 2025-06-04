INSERT INTO
    burgers (
        id,
        name,
        restaurant_id,
        main_ingredient,
        amount,
        bread,
        ingredients,
        more_ingredients,
        allergens,
        price,
        taste_rating,
        presentation_rating,
        quality_price_rating,
        image
    )
VALUES (
        '014',
        'La Vegana',
        '010',
        'Beyond meat',
        NULL,
        'arepa bread',
        'hummus, pico de gallo',
        'chickpeas, cumin, sesame seeds, coriander, tomato, onion, cilantro',
        'tree nuts, sesame seeds',
        14.20,
        4,
        3.5,
        4,
        '/img/014.png'
    );

INSERT INTO
    reviews (
        burger_id,
        user_id,
        taste_rating,
        presentation_rating,
        quality_price_rating,
        comment
    )
VALUES ('014', 1, 4, 3.5, 4, NULL);

UPDATE burgers
SET
    allergens = "gluten, eggs, soy, dairy, mustard, sesame seeds"
WHERE
    id = '004';

UPDATE burgers
SET
    allergens = "gluten, eggs, soy, dairy, mustard, sesame seeds"
WHERE
    id = '005';

UPDATE burgers
SET
    bread = "Brioche (gluten-free bread available)"
WHERE
    restaurant_id = '002';

UPDATE burgers
SET
    allergens = "eggs, dairy, mustard, fish"
WHERE
    id = '003';

UPDATE burgers
SET
    allergens = "eggs, dairy, soy"
WHERE
    id = '012';

UPDATE burgers
SET
    allergens = "eggs, dairy, sulphites"
WHERE
    id = '013';

UPDATE burgers
SET
    allergens = "gluten, dairy"
WHERE
    id = '011';

UPDATE restaurants
SET
    name = "Umbrella SH"
WHERE
    id = '011';

INSERT INTO
    restaurants (
        id,
        name,
        address,
        url,
        image,
        website
    )
VALUES (
        '014',
        'Brutal58',
        'C/ Italia, 33, 03003 Alicante',
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3129.38009398037!2d-0.4916238!3d38.3401838!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd62370d8766d763%3A0xaaa43b99cf3e2227!2sBrutal58!5e0!3m2!1sen!2ses!4v1748974954326!5m2!1sen!2ses',
        '/img/placeholder.jpg?height=60&width=60',
        'https://www.grupobrutal58.com/'
    );

