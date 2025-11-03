type ViewConst = { name: string; expression: string };

export const USER_SUMMARY_VIEW: ViewConst = {
  name: 'user_summary_view',
  expression: `
    SELECT
      u.id,
      u.first_name,
      u.last_name,
      u.email,
      s.name AS status_name,
      f.path AS photo_url
    FROM "user" u
    LEFT JOIN status s ON u.status_id = s.id
    LEFT JOIN file f ON u.photo_id = f.id
    WHERE s.name = 'Active'
  `,
};
