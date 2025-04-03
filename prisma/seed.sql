-- Insert users
INSERT INTO "User" ("id", "name", "email") VALUES
  ('1', 'Alice', 'alice@example.com'),
  ('2', 'Bob', 'bob@example.com'),
  ('3', 'Charlie', 'charlie@example.com');

-- Insert tasks
INSERT INTO "Task" ("id", "title", "description", "status", "priority", "assignedToId", "dueDate") VALUES
  ('1', 'Task 1', 'This is task 1 description', 'TODO', 'HIGH', '1', '2025-05-01'),
  ('2', 'Task 2', 'This is task 2 description', 'IN_PROGRESS', 'MEDIUM', '2', '2025-06-01'),
  ('3', 'Task 3', 'This is task 3 description', 'DONE', 'LOW', '3', '2025-07-01');
