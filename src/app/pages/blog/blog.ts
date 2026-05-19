import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { BLOG_POSTS } from '../../data/blog-posts';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [RouterLink, NgFor],
  templateUrl: './blog.html',
  styleUrl: './blog.scss'
})
export class Blog {
  posts = BLOG_POSTS;
}
