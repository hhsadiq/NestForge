import path from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeaderResolver } from 'nestjs-i18n';
import { I18nModule } from 'nestjs-i18n/dist/i18n.module';
import { DataSource, DataSourceOptions } from 'typeorm';

import { BiometricChallengeModule } from '@src/biometric-challenges/biometric-challenges.module';

import { PoemMediaModule } from './poem-media/poem-media.module';
import { MediaPlatformsModule } from './media-platforms/media-platforms.module';
import { ReviewFeedbacksModule } from './review-feedbacks/review-feedbacks.module';
import { FeedbackPresetsModule } from './feedback-presets/feedback-presets.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ReviewersModule } from './reviewers/reviewers.module';
import { VerseTagsModule } from './verse-tags/verse-tags.module';
import { PoemTagsModule } from './poem-tags/poem-tags.module';
import { ParagraphTagsModule } from './paragraph-tags/paragraph-tags.module';
import { SectionTagsModule } from './section-tags/section-tags.module';
import { TagsModule } from './tags/tags.module';
import { TranslationsModule } from './translations/translations.module';
import { TranslatorsModule } from './translators/translators.module';
import { WorkflowStatusesModule } from './workflow-statuses/workflow-statuses.module';
import { VerseAuthorsModule } from './verse-authors/verse-authors.module';
import { VersesModule } from './verses/verses.module';
import { StanzasModule } from './stanzas/stanzas.module';
import { PoemsModule } from './poems/poems.module';
import { MetersModule } from './meters/meters.module';
import { PoemFormsModule } from './poem-forms/poem-forms.module';
import { ParagraphsModule } from './paragraphs/paragraphs.module';
import { SectionsModule } from './sections/sections.module';
import { BookAuthorsModule } from './book-authors/book-authors.module';
import { BooksModule } from './books/books.module';
import { AuthorsModule } from './authors/authors.module';
import { LanguagesModule } from './languages/languages.module';
import { AuthModule } from './auth/auth.module';
import authConfig from './auth/config/auth.config';
import { AuthAppleModule } from './auth-apple/auth-apple.module';
import appleConfig from './auth-apple/config/apple.config';
import { AuthFacebookModule } from './auth-facebook/auth-facebook.module';
import facebookConfig from './auth-facebook/config/facebook.config';
import { AuthGoogleModule } from './auth-google/auth-google.module';
import googleConfig from './auth-google/config/google.config';
import { AuthTwitterModule } from './auth-twitter/auth-twitter.module';
import twitterConfig from './auth-twitter/config/twitter.config';
import appConfig from './config/app.config';
import { AllConfigType } from './config/config.type';
import databaseConfig from './database/config/database.config';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import fileConfig from './files/config/file.config';
import { FilesModule } from './files/files.module';
import genAiConfig from './gen-ai/config/gen-ai.config';
import { GenAiModule } from './gen-ai/gen-ai.module';
import { HomeModule } from './home/home.module';
import mailConfig from './mail/config/mail.config';
import { MailModule } from './mail/mail.module';
import { MailerModule } from './mailer/mailer.module';
import { SessionModule } from './sessions/session.module';
import { UsersModule } from './users/users.module';
import { ViewsModule } from './views/views.module';

const infrastructureDatabaseModule = TypeOrmModule.forRootAsync({
  useClass: TypeOrmConfigService,
  dataSourceFactory: async (options: DataSourceOptions) => {
    return new DataSource(options).initialize();
  },
});

@Module({
  imports: [
    PoemMediaModule,
    MediaPlatformsModule,
    ReviewFeedbacksModule,
    FeedbackPresetsModule,
    ReviewsModule,
    ReviewersModule,
    VerseTagsModule,
    PoemTagsModule,
    ParagraphTagsModule,
    SectionTagsModule,
    TagsModule,
    TranslationsModule,
    TranslatorsModule,
    WorkflowStatusesModule,
    VerseAuthorsModule,
    VersesModule,
    StanzasModule,
    PoemsModule,
    MetersModule,
    PoemFormsModule,
    ParagraphsModule,
    SectionsModule,
    BookAuthorsModule,
    BooksModule,
    AuthorsModule,
    LanguagesModule,
    GenAiModule,
    ViewsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        authConfig,
        appConfig,
        mailConfig,
        fileConfig,
        facebookConfig,
        googleConfig,
        twitterConfig,
        appleConfig,
        genAiConfig,
      ],
      envFilePath: ['.env'],
    }),
    infrastructureDatabaseModule,
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
          infer: true,
        }),
        loaderOptions: { path: path.join(__dirname, '/i18n/'), watch: true },
      }),
      resolvers: [
        {
          use: HeaderResolver,
          useFactory: (configService: ConfigService<AllConfigType>) => {
            return [
              configService.get('app.headerLanguage', {
                infer: true,
              }),
            ];
          },
          inject: [ConfigService],
        },
      ],
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    UsersModule,
    FilesModule,
    AuthModule,
    AuthFacebookModule,
    AuthGoogleModule,
    AuthTwitterModule,
    AuthAppleModule,
    BiometricChallengeModule,
    SessionModule,
    MailModule,
    MailerModule,
    HomeModule,
  ],
})
export class AppModule {}
