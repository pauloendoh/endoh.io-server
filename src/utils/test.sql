SELECT
    json_build_object(
        'userId',
        FUS.id,
        'username',
        FUS.username,
        'fullName',
        PRO."fullName"
    ) AS "followingUser",
    (
        SELECT
            JSON_AGG(B)
        FROM
            "following_tag" A
            INNER JOIN "tag" B ON B.id = A."tagId"
        WHERE
            A."followingUserId" = FUS.id
            AND A."followerId" = $ 1
    ) AS "tags"
FROM
    "following_tag" FTG
    INNER JOIN "user" FUS ON FUS.id = FTG."followingUserId"
    INNER JOIN "profile" PRO ON PRO."userId" = FUS."id"
WHERE
    FTG."followerId" = $ 1
GROUP BY
    FUS.id,
    PRO."fullName"