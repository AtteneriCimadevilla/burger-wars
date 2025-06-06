UPDATE burgers
SET
    vegetarian = TRUE
WHERE
    id IN ('011', '014');

UPDATE burgers
SET
    vegan = TRUE
WHERE
    id IN ('014');