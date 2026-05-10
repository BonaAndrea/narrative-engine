#nullable enable
using System;
using System.Collections.Generic;

namespace NarrativeEngine.API.Models.Domain
{
    // Domain models for the Narrative Engine

    public class Story
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public Guid AuthorId { get; set; }
        public Guid StartSceneId { get; set; }
        public bool Published { get; set; }
        public DateTime CreatedAt { get; set; }

        // Navigation: Scenes contained in this story
        public ICollection<Scene> Scenes { get; set; } = new List<Scene>();
    }

    public class Scene
    {
        public Guid Id { get; set; }
        public Guid StoryId { get; set; }
        public string Title { get; set; } = string.Empty;

        // Content stores a JSON array (e.g., blocks, paragraphs, nodes)
        public string Content { get; set; } = string.Empty;

        public string? BackgroundAsset { get; set; }
        public string? MusicAsset { get; set; }

        // JSON storing effects to run when entering this scene
        public string? OnEnterEffects { get; set; }

        // Navigation back to parent story
        public Story? Story { get; set; }

        // Choices available from this scene
        public ICollection<Choice> Choices { get; set; } = new List<Choice>();
    }

    public class Choice
    {
        public Guid Id { get; set; }
        public Guid SceneId { get; set; }
        public string Text { get; set; } = string.Empty;
        public Guid TargetSceneId { get; set; }

        // Optional JSON conditions (predicate data)
        public string? Conditions { get; set; }

        // JSON representing effects triggered by this choice
        public string Effects { get; set; } = string.Empty;

        public int SortOrder { get; set; }

        // Navigation back to parent scene
        public Scene? Scene { get; set; }
    }

    public class SaveSlot
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid StoryId { get; set; }
        public string SlotName { get; set; } = string.Empty;
        public Guid CurrentSceneId { get; set; }

        // JSON blobs storing runtime state
        public string Variables { get; set; } = string.Empty;
        public string Flags { get; set; } = string.Empty;
        public string ChoiceHistory { get; set; } = string.Empty;
        public string VisitedScenes { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class User
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
