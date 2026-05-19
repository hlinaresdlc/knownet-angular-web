import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BLOG_POSTS } from '../../data/blog-posts';

@Component({
  selector: 'app-blog-detail',
  imports: [],
  templateUrl: './blog-detail.html',
  styleUrl: './blog-detail.scss'
})
export class BlogDetail {

  post: any;

  constructor(private route: ActivatedRoute) {

    const slug = this.route.snapshot.paramMap.get('slug');

    this.post = BLOG_POSTS.find(p => p.slug === slug);

  }

}
