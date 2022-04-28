import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1651178177911 implements MigrationInterface {
  name = "Migration1651178177911";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    
    ALTER TABLE "public"."resource" ADD "document_with_weights" tsvector;
 
    update resource set document_with_weights = setweight(to_tsvector(title), 'A') ||
         setweight(to_tsvector(url), 'B') ||
           setweight(to_tsvector(coalesce("publicReview"  , '')), 'C');
          
          
          
          
       CREATE INDEX document_weights_idx
         ON resource
         USING GIN (document_with_weights);
        
               CREATE FUNCTION resource_tsvector_trigger() RETURNS trigger AS $$
       begin
         new.document_with_weights :=
         setweight(to_tsvector('english', coalesce(new.title, '')), 'A')
         || setweight(to_tsvector('english', coalesce(new.url, '')), 'B')
         || setweight(to_tsvector('english', coalesce(new."publicReview", '')), 'C');
         return new;
       end
       $$ LANGUAGE plpgsql;
      
       CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
           ON resource FOR EACH ROW EXECUTE PROCEDURE resource_tsvector_trigger();
              `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."resource" DROP COLUMN "document_with_weights";
      
      DROP TRIGGER tsvectorupdate  ON resource;

      DROP FUNCTION resource_tsvector_trigger;
      `
    );
  }
}
