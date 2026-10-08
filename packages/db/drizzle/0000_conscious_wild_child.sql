CREATE TYPE "public"."gender" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TABLE "attempt_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"attempt_id" uuid NOT NULL,
	"question_key" varchar(40) NOT NULL,
	"position" smallint NOT NULL,
	"decoy_option_key" varchar(8) NOT NULL,
	"correct_first" boolean NOT NULL,
	"chosen_option_key" varchar(8),
	"is_correct" boolean
);
--> statement-breakpoint
CREATE TABLE "attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quiz_id" uuid NOT NULL,
	"visitor_id" uuid NOT NULL,
	"friend_name" varchar(15) NOT NULL,
	"score" smallint,
	"total" smallint,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "quiz_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quiz_id" uuid NOT NULL,
	"question_key" varchar(40) NOT NULL,
	"correct_option_key" varchar(8) NOT NULL,
	"position" smallint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quizzes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(16) NOT NULL,
	"owner_visitor_id" uuid NOT NULL,
	"owner_name" varchar(15) NOT NULL,
	"gender" "gender" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "quizzes_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "attempt_questions" ADD CONSTRAINT "attempt_questions_attempt_id_attempts_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."attempts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "attempt_questions_attempt_position_uq" ON "attempt_questions" USING btree ("attempt_id","position");--> statement-breakpoint
CREATE UNIQUE INDEX "attempt_questions_attempt_question_uq" ON "attempt_questions" USING btree ("attempt_id","question_key");--> statement-breakpoint
CREATE UNIQUE INDEX "attempts_quiz_visitor_uq" ON "attempts" USING btree ("quiz_id","visitor_id");--> statement-breakpoint
CREATE INDEX "attempts_quiz_idx" ON "attempts" USING btree ("quiz_id");--> statement-breakpoint
CREATE UNIQUE INDEX "quiz_questions_quiz_question_uq" ON "quiz_questions" USING btree ("quiz_id","question_key");--> statement-breakpoint
CREATE INDEX "quizzes_owner_visitor_idx" ON "quizzes" USING btree ("owner_visitor_id");