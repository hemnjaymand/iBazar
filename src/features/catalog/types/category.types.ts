export interface CategoryTreeItem {
  id: string;
  name: string;
  slug: string;
  imageUrl:string;
  children: CategoryTreeItem[];
}
