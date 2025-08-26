@@ .. @@
 -- Create profiles table
 CREATE TABLE IF NOT EXISTS profiles (
   id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
   email text NOT NULL,
   full_name text NOT NULL,
   role user_role DEFAULT 'student' NOT NULL,
   avatar_url text,
-  created_at timestamptz DEFAULT now() NOT NULL,
-  updated_at timestamptz DEFAULT now() NOT NULL
+  created_at timestamptz DEFAULT now(),
+  updated_at timestamptz DEFAULT now()
 );
 
 -- Enable RLS on profiles table
@@ .. @@
 -- Function to handle new user creation
 CREATE OR REPLACE FUNCTION handle_new_user()
 RETURNS trigger AS $$
 BEGIN
-  INSERT INTO profiles (id, email, full_name, role)
-  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), 'student');
+  INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
+  VALUES (
+    NEW.id, 
+    NEW.email, 
+    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), 
+    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student'),
+    now(),
+    now()
+  );
   RETURN NEW;
 END;
 $$ LANGUAGE plpgsql SECURITY DEFINER;