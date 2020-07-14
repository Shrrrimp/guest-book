import { Answer } from './answer.model';
import { User } from 'src/app/profile/models/user.model';

export interface Comment {
    answers: Answer[];
    answers_count: number;
    created_at: string;
    id: number;
    message: string;
    title: string;
    updated_at: string;
    user: User;
    user_id: number;
}

export interface CommentsList {
    data: Comment[];
    links: {
        first: string;
        last: string;
        next: string | null;
        prev: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

