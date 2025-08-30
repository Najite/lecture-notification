@@ .. @@
   id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
   email text UNIQUE NOT NULL,
   full_name text NOT NULL,
   role user_role DEFAULT 'student' NOT NULL,
   avatar_url text,
-  created_at timestamptz,
-  updated_at timestamptz
+  created_at timestamptz DEFAULT now() NOT NULL,
+  updated_at timestamptz DEFAULT now() NOT NULL
 );